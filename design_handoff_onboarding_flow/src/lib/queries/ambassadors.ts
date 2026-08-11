import { supabase } from '../supabase';
import type { Database } from '../database.types';

type AmbassadorStatsRow = Database['public']['Views']['ambassador_stats']['Row'];
type SaleRow = Database['public']['Tables']['sales']['Row'];
type ContentPostRow = Database['public']['Tables']['content_posts']['Row'];
type LedgerRow = Database['public']['Tables']['credit_ledger']['Row'];
type RedemptionRow = Database['public']['Tables']['redemptions']['Row'];

export type AmbassadorListItem = AmbassadorStatsRow & { coupon: string | null };

export async function fetchAmbassadorsList(): Promise<AmbassadorListItem[]> {
  const [statsRes, couponsRes] = await Promise.all([
    supabase.from('ambassador_stats').select('*').order('score', { ascending: false }),
    supabase.from('coupons').select('ambassador_id, code'),
  ]);

  const couponByAmbassador = new Map<string, string>();
  for (const c of couponsRes.data ?? []) {
    if (!couponByAmbassador.has(c.ambassador_id)) couponByAmbassador.set(c.ambassador_id, c.code);
  }

  return (statsRes.data ?? []).map((a) => ({ ...a, coupon: couponByAmbassador.get(a.id!) ?? null }));
}

export type AmbassadorDetail = {
  stats: AmbassadorStatsRow;
  coupon: string | null;
  sales: SaleRow[];
  content: ContentPostRow[];
  ledger: LedgerRow[];
  redemptions: RedemptionRow[];
};

export async function fetchAmbassadorDetail(id: string): Promise<AmbassadorDetail | null> {
  const [statsRes, couponRes, salesRes, contentRes, ledgerRes, redemptionsRes] = await Promise.all([
    supabase.from('ambassador_stats').select('*').eq('id', id).maybeSingle(),
    supabase.from('coupons').select('code').eq('ambassador_id', id).limit(1).maybeSingle(),
    supabase.from('sales').select('*').eq('ambassador_id', id).order('sale_date', { ascending: false }),
    supabase.from('content_posts').select('*').eq('ambassador_id', id).order('publish_date', { ascending: false }),
    supabase.from('credit_ledger').select('*').eq('ambassador_id', id).order('created_at', { ascending: false }),
    supabase.from('redemptions').select('*').eq('ambassador_id', id).order('created_at', { ascending: false }),
  ]);

  if (!statsRes.data) return null;

  return {
    stats: statsRes.data,
    coupon: couponRes.data?.code ?? null,
    sales: salesRes.data ?? [],
    content: contentRes.data ?? [],
    ledger: ledgerRes.data ?? [],
    redemptions: redemptionsRes.data ?? [],
  };
}
