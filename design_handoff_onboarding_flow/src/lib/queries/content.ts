import { supabase } from '../supabase';
import type { Database } from '../database.types';
import { fetchCreditRules } from './creditRules';

type ContentPostRow = Database['public']['Tables']['content_posts']['Row'];

export type DerivedStatus = 'monitorando' | 'validado' | 'removido' | 'revisar';

export const STATUS_META: Record<DerivedStatus, { label: string; bg: string; fg: string; bar: string }> = {
  validado: { label: 'Validado', bg: '#e3efe1', fg: '#5a8f6a', bar: '#5a8f6a' },
  monitorando: { label: 'Monitorando', bg: '#f6ecd6', fg: '#b08a3a', bar: '#c67d88' },
  removido: { label: 'Removido', bg: '#f6dcd8', fg: '#c05a4e', bar: '#c05a4e' },
  revisar: { label: 'Revisar', bg: '#e7e0f0', fg: '#7a6ca0', bar: '#9a8fb0' },
};

/**
 * The schema has no single "queue status" field — it's derived from `approval_status`
 * plus the detection checklist, the same signals a human reviewer would read.
 */
export function deriveStatus(c: Pick<ContentPostRow, 'approval_status' | 'checklist_mentioned_brand' | 'still_live'>): DerivedStatus {
  if (c.approval_status === 'approved') return 'validado';
  if (c.approval_status === 'rejected') return 'removido';
  if (!c.checklist_mentioned_brand) return 'revisar';
  if (!c.still_live) return 'removido';
  return 'monitorando';
}

// The schema stores no "days required to stay live" field — these are the same
// requirements shown in the mockups (24h for a story, 30 days in-feed otherwise),
// applied here to a `publish_date` (day-precision, so this is an approximation).
const TARGET_DAYS: Record<ContentPostRow['content_type'], number> = { story: 1, post: 30, reels: 30 };
const REQ_LABEL: Record<ContentPostRow['content_type'], string> = { story: '24h no ar', post: '30 dias no feed', reels: '30 dias no feed' };

export type ContentQueueItem = {
  row: ContentPostRow;
  ambassadorName: string;
  ambassadorId: string;
  coupon: string | null;
  status: DerivedStatus;
  pct: number;
  reqLabel: string;
  elapsedLabel: string;
  detectLabel: string;
};

function daysSince(dateStr: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000));
}

function enrich(row: ContentPostRow, ambassadorName: string, coupon: string | null): ContentQueueItem {
  const status = deriveStatus(row);
  const days = daysSince(row.publish_date);
  const target = TARGET_DAYS[row.content_type];
  const pct = status === 'validado' ? 100 : Math.min(100, Math.round((days / target) * 100));
  return {
    row,
    ambassadorName,
    ambassadorId: row.ambassador_id,
    coupon,
    status,
    pct,
    reqLabel: REQ_LABEL[row.content_type],
    elapsedLabel: `${Math.min(days, target)} de ${target} ${target === 1 ? 'dia' : 'dias'}`,
    detectLabel: row.checklist_mentioned_brand
      ? `✓ marca${coupon ? ` · ✓ ${coupon}` : ''}`
      : '⚠ marca não marcada',
  };
}

export async function fetchContentQueue(): Promise<ContentQueueItem[]> {
  const [postsRes, ambRes, couponsRes] = await Promise.all([
    supabase.from('content_posts').select('*').order('publish_date', { ascending: false }),
    supabase.from('ambassadors').select('id, name'),
    supabase.from('coupons').select('ambassador_id, code'),
  ]);
  const nameById = new Map((ambRes.data ?? []).map((a) => [a.id, a.name]));
  const couponById = new Map((couponsRes.data ?? []).map((c) => [c.ambassador_id, c.code]));
  return (postsRes.data ?? []).map((row) =>
    enrich(row, nameById.get(row.ambassador_id) ?? '—', couponById.get(row.ambassador_id) ?? null),
  );
}

export async function fetchContentItem(id: string): Promise<ContentQueueItem | null> {
  const { data: row } = await supabase.from('content_posts').select('*').eq('id', id).maybeSingle();
  if (!row) return null;
  const [ambRes, couponRes] = await Promise.all([
    supabase.from('ambassadors').select('name').eq('id', row.ambassador_id).maybeSingle(),
    supabase.from('coupons').select('code').eq('ambassador_id', row.ambassador_id).limit(1).maybeSingle(),
  ]);
  return enrich(row, ambRes.data?.name ?? '—', couponRes.data?.code ?? null);
}

export async function validateContent(item: ContentQueueItem): Promise<{ error: string | null; credit: number }> {
  const rules = await fetchCreditRules();
  const credit = rules ? (item.row.content_type === 'story' ? Number(rules.story_credit_value) : Number(rules.post_credit_value)) : 0;

  const { error: updateError } = await supabase
    .from('content_posts')
    .update({ approval_status: 'approved', credit_generated: credit, checklist_mentioned_brand: true, last_checked_at: new Date().toISOString().slice(0, 10) })
    .eq('id', item.row.id);
  if (updateError) return { error: updateError.message, credit };

  const { error: ledgerError } = await supabase.from('credit_ledger').insert({
    brand_id: item.row.brand_id,
    ambassador_id: item.row.ambassador_id,
    source: 'content',
    source_content_id: item.row.id,
    amount: credit,
  });
  return { error: ledgerError?.message ?? null, credit };
}

export async function rejectContent(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('content_posts')
    .update({ approval_status: 'rejected', still_live: false, last_checked_at: new Date().toISOString().slice(0, 10) })
    .eq('id', id);
  return { error: error?.message ?? null };
}
