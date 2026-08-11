import { supabase } from '../supabase';
import type { Database } from '../database.types';

export type CreditRules = Database['public']['Tables']['credit_rules']['Row'];

export type PerformanceTier = {
  name: string;
  credit_pct: number;
  min_sales_per_month?: number;
  min_consistent_months?: number;
};

export function performanceTiers(rules: CreditRules): PerformanceTier[] {
  return Array.isArray(rules.performance_tiers) ? (rules.performance_tiers as unknown as PerformanceTier[]) : [];
}

/**
 * Picks the highest-credit tier an ambassador currently qualifies for. `salesCount30d`
 * comes from `ambassador_stats`; `monthsActive` is derived from `ambassadors.joined_at`.
 * Falls back to the first (lowest) tier when nothing else qualifies.
 */
export function currentTierFor(
  tiers: PerformanceTier[],
  salesCount30d: number,
  monthsActive: number,
): PerformanceTier | null {
  if (tiers.length === 0) return null;
  const qualifying = tiers.filter((t) => {
    const bySales = t.min_sales_per_month !== undefined && salesCount30d >= t.min_sales_per_month;
    const byMonths = t.min_consistent_months !== undefined && monthsActive >= t.min_consistent_months;
    const hasThreshold = t.min_sales_per_month !== undefined || t.min_consistent_months !== undefined;
    return !hasThreshold || bySales || byMonths;
  });
  const pool = qualifying.length > 0 ? qualifying : [tiers[0]];
  return pool.reduce((best, t) => (t.credit_pct > best.credit_pct ? t : best), pool[0]);
}

export function monthsActiveSince(joinedAt: string): number {
  const days = (Date.now() - new Date(joinedAt).getTime()) / 86400000;
  return days / 30;
}

export async function fetchCreditRules(): Promise<CreditRules | null> {
  const { data } = await supabase.from('credit_rules').select('*').maybeSingle();
  return data;
}

export type CreditRulesInput = Omit<Database['public']['Tables']['credit_rules']['Update'], 'brand_id' | 'id'>;

/** Updates the existing row, or inserts one (a brand onboarded before this feature may not have one yet). */
export async function saveCreditRules(brandId: string, existingId: string | null, input: CreditRulesInput) {
  if (existingId) {
    const { error } = await supabase.from('credit_rules').update(input).eq('id', existingId);
    return { error: error?.message ?? null };
  }
  const { error } = await supabase.from('credit_rules').insert({ ...input, brand_id: brandId });
  return { error: error?.message ?? null };
}
