import { supabase } from '../supabase';
import type { Period } from '../../data/dashboardData';

const PERIOD_DAYS: Record<Period, number> = { '7d': 7, '30d': 30, '90d': 90 };

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export type DashboardStats = {
  ativas: number;
  ativasDelta: number;
  gmv: number;
  gmvDeltaPct: number | null;
  resgatePct: number | null;
  convPct: number | null;
  budgetUsed: number;
  budgetCap: number;
  budgetPct: number;
};

/**
 * All figures are derived, not stored — the schema has no pre-aggregated KPI table.
 * "ativas" = distinct ambassadors with a sale or content post in the window (an
 * engagement-based definition, so it can meaningfully vary by period, vs. the static
 * `ambassadors.status` column). "budgetCap" prorates `credit_rules.content_monthly_cap`
 * (a per-ambassador monthly figure) by active-ambassador-count × period-length/30 —
 * the schema has no brand-wide budget field to compare against directly.
 */
export async function fetchDashboardStats(period: Period): Promise<DashboardStats> {
  const days = PERIOD_DAYS[period];
  const cutoff = isoDaysAgo(days);
  const prevCutoff = isoDaysAgo(days * 2);

  const [salesRes, prevSalesRes, contentRes, prevContentRes, ledgerRes, redemptionsRes, activeAmbRes, rulesRes] =
    await Promise.all([
      supabase.from('sales').select('ambassador_id, order_amount, sale_date').gte('sale_date', cutoff),
      supabase.from('sales').select('ambassador_id, order_amount').gte('sale_date', prevCutoff).lt('sale_date', cutoff),
      supabase.from('content_posts').select('ambassador_id, credit_generated, publish_date').gte('publish_date', cutoff),
      supabase.from('content_posts').select('ambassador_id').gte('publish_date', prevCutoff).lt('publish_date', cutoff),
      supabase.from('credit_ledger').select('amount, created_at').gte('created_at', cutoff),
      supabase.from('redemptions').select('amount_deducted, redeemed_at').gte('redeemed_at', cutoff),
      supabase.from('ambassadors').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('credit_rules').select('content_monthly_cap').maybeSingle(),
    ]);

  const sales = salesRes.data ?? [];
  const prevSales = prevSalesRes.data ?? [];
  const content = contentRes.data ?? [];
  const prevContent = prevContentRes.data ?? [];
  const ledger = ledgerRes.data ?? [];
  const redemptions = redemptionsRes.data ?? [];
  const activeCount = activeAmbRes.count ?? 0;
  const contentMonthlyCap = rulesRes.data?.content_monthly_cap ?? 0;

  const activeAmbassadorIds = new Set<string>([
    ...sales.map((s) => s.ambassador_id),
    ...content.map((c) => c.ambassador_id),
  ]);
  const prevActiveAmbassadorIds = new Set<string>([
    ...prevSales.map((s) => s.ambassador_id),
    ...prevContent.map((c) => c.ambassador_id),
  ]);

  const gmv = sales.reduce((sum, s) => sum + Number(s.order_amount), 0);
  const prevGmv = prevSales.reduce((sum, s) => sum + Number(s.order_amount), 0);
  const gmvDeltaPct = prevGmv > 0 ? ((gmv - prevGmv) / prevGmv) * 100 : gmv > 0 ? 100 : null;

  const creditGenerated = ledger.reduce((sum, l) => sum + Number(l.amount), 0);
  const redeemed = redemptions.reduce((sum, r) => sum + Number(r.amount_deducted), 0);
  const resgatePct = creditGenerated > 0 ? (redeemed / creditGenerated) * 100 : null;

  const sellingAmbassadors = new Set(sales.map((s) => s.ambassador_id)).size;
  const convPct = activeCount > 0 ? (sellingAmbassadors / activeCount) * 100 : null;

  const budgetUsed = content.reduce((sum, c) => sum + Number(c.credit_generated), 0);
  const budgetCap = contentMonthlyCap * activeCount * (days / 30);

  return {
    ativas: activeAmbassadorIds.size,
    ativasDelta: activeAmbassadorIds.size - prevActiveAmbassadorIds.size,
    gmv,
    gmvDeltaPct,
    resgatePct,
    convPct,
    budgetUsed,
    budgetCap,
    budgetPct: budgetCap > 0 ? Math.min(100, (budgetUsed / budgetCap) * 100) : 0,
  };
}

export type RankingRow = {
  id: string;
  name: string;
  handle: string | null;
  level: 'nano' | 'micro' | 'macro';
  score: number;
  gmv_30d: number;
};

export async function fetchRanking(limit = 5): Promise<RankingRow[]> {
  const { data } = await supabase
    .from('ambassador_stats')
    .select('id, name, handle, level, score, gmv_30d')
    .order('score', { ascending: false })
    .limit(limit);
  return (data ?? []).map((r) => ({
    id: r.id!,
    name: r.name!,
    handle: r.handle,
    level: r.level!,
    score: r.score ?? 0,
    gmv_30d: r.gmv_30d ?? 0,
  }));
}
