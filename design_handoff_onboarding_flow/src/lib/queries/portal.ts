import { supabase } from '../supabase';
import type { Database } from '../database.types';
import { currentTierFor, monthsActiveSince, performanceTiers, fetchCreditRules } from './creditRules';
import { mergeLedger } from './ledger';

type AmbassadorStatsRow = Database['public']['Views']['ambassador_stats']['Row'];

export type PortalMe = {
  stats: AmbassadorStatsRow;
  coupon: string | null;
  brandName: string;
  levelName: string;
  levelPct: number;
  liveContent: number;
  creditMonth: number;
};

export async function fetchPortalHome(): Promise<PortalMe | null> {
  const [statsRes, couponRes, brandRes, rules, liveContentRes, ledgerRes] = await Promise.all([
    supabase.from('ambassador_stats').select('*').maybeSingle(),
    supabase.from('coupons').select('code').limit(1).maybeSingle(),
    supabase.from('brands').select('name').maybeSingle(),
    fetchCreditRules(),
    supabase.from('content_posts').select('id', { count: 'exact', head: true }).eq('still_live', true).neq('approval_status', 'rejected'),
    supabase.from('credit_ledger').select('amount').gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString()),
  ]);

  if (!statsRes.data) return null;
  const stats = statsRes.data;

  let levelName = '—';
  let levelPct = 0;
  if (rules) {
    const tiers = performanceTiers(rules);
    const salesCount = stats.sales_count_30d ?? 0;
    const months = monthsActiveSince(stats.joined_at!);
    const tier = currentTierFor(tiers, salesCount, months);
    levelName = tier?.name ?? '—';
    const sorted = [...tiers].sort((a, b) => a.credit_pct - b.credit_pct);
    const idx = sorted.findIndex((t) => t.name === tier?.name);
    const next = sorted[idx + 1];
    if (!next) {
      levelPct = 100;
    } else if (next.min_sales_per_month !== undefined) {
      levelPct = Math.min(100, Math.round((salesCount / next.min_sales_per_month) * 100));
    } else if (next.min_consistent_months !== undefined) {
      levelPct = Math.min(100, Math.round((months / next.min_consistent_months) * 100));
    }
  }

  return {
    stats,
    coupon: couponRes.data?.code ?? null,
    brandName: brandRes.data?.name ?? '—',
    levelName,
    levelPct,
    liveContent: liveContentRes.count ?? 0,
    creditMonth: (ledgerRes.data ?? []).reduce((s, l) => s + Number(l.amount), 0),
  };
}

export type PortalActivityEntry = {
  key: string;
  icon: string;
  title: string;
  date: string;
  value: string;
  iconBg: string;
  iconFg: string;
  valColor: string;
};

export async function fetchPortalActivity(limit = 6): Promise<PortalActivityEntry[]> {
  const [salesRes, contentRes, redemptionsRes] = await Promise.all([
    supabase.from('sales').select('*').order('sale_date', { ascending: false }).limit(limit),
    supabase.from('content_posts').select('*').eq('approval_status', 'approved').order('publish_date', { ascending: false }).limit(limit),
    supabase.from('redemptions').select('*').order('created_at', { ascending: false }).limit(limit),
  ]);

  const entries: PortalActivityEntry[] = [
    ...(salesRes.data ?? []).map((s) => ({
      key: 's' + s.id,
      icon: '↑',
      title: 'Venda registrada',
      date: s.sale_date,
      value: '+ R$ ' + Math.round(Number(s.credit_generated)),
      iconBg: '#e3efe1',
      iconFg: '#5a8f6a',
      valColor: '#5a8f6a',
    })),
    ...(contentRes.data ?? []).map((c) => ({
      key: 'c' + c.id,
      icon: '✓',
      title: `${c.content_type} validado`,
      date: c.publish_date,
      value: '+ R$ ' + Math.round(Number(c.credit_generated)),
      iconBg: '#e3efe1',
      iconFg: '#5a8f6a',
      valColor: '#5a8f6a',
    })),
    ...(redemptionsRes.data ?? []).map((r) => ({
      key: 'r' + r.id,
      icon: '↓',
      title: 'Resgate · ' + r.item_redeemed,
      date: r.redeemed_at,
      value: '- R$ ' + Math.round(Number(r.amount_deducted)),
      iconBg: '#faf1f0',
      iconFg: '#c67d88',
      valColor: '#c05a4e',
    })),
  ];

  return entries.sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, limit);
}

export async function fetchPortalSales() {
  const { data } = await supabase.from('sales').select('*').order('sale_date', { ascending: false });
  return data ?? [];
}

export async function fetchPortalContent() {
  const { data } = await supabase.from('content_posts').select('*').order('publish_date', { ascending: false });
  return data ?? [];
}

export async function fetchPortalCredit() {
  const [ledgerRes, redemptionsRes] = await Promise.all([
    supabase.from('credit_ledger').select('*').order('created_at', { ascending: false }),
    supabase.from('redemptions').select('*').order('created_at', { ascending: false }),
  ]);
  return mergeLedger(ledgerRes.data ?? [], redemptionsRes.data ?? []);
}
