import { supabase } from '../supabase';
import type { Database } from '../database.types';
import { currentTierFor, monthsActiveSince, performanceTiers, type CreditRules } from './creditRules';

type AmbassadorLevel = Database['public']['Enums']['ambassador_level'];

export type CouponWithAmbassador = {
  couponId: string;
  code: string;
  shop: string | null;
  ambassadorId: string;
  ambassadorName: string;
  ambassadorStatus: 'active' | 'inactive';
  level: AmbassadorLevel;
  salesCount30d: number;
  joinedAt: string;
  uses: number;
};

export async function fetchCouponsWithAmbassadors(): Promise<CouponWithAmbassador[]> {
  const [couponsRes, statsRes, salesRes] = await Promise.all([
    supabase.from('coupons').select('id, code, shopify_shop_domain, ambassador_id'),
    supabase.from('ambassador_stats').select('id, name, status, level, sales_count_30d, joined_at'),
    supabase.from('sales').select('coupon_id'),
  ]);

  const statsById = new Map((statsRes.data ?? []).map((s) => [s.id!, s]));
  const usesByCoupon = new Map<string, number>();
  for (const s of salesRes.data ?? []) {
    usesByCoupon.set(s.coupon_id, (usesByCoupon.get(s.coupon_id) ?? 0) + 1);
  }

  return (couponsRes.data ?? []).flatMap((c) => {
    const amb = statsById.get(c.ambassador_id);
    if (!amb) return [];
    return [
      {
        couponId: c.id,
        code: c.code,
        shop: c.shopify_shop_domain,
        ambassadorId: c.ambassador_id,
        ambassadorName: amb.name!,
        ambassadorStatus: amb.status!,
        level: amb.level!,
        salesCount30d: amb.sales_count_30d ?? 0,
        joinedAt: amb.joined_at!,
        uses: usesByCoupon.get(c.id) ?? 0,
      },
    ];
  });
}

export type SaleHistoryItem = {
  id: string;
  value: number;
  date: string;
  code: string;
  ambassadorName: string;
  credit: number;
  level: AmbassadorLevel;
};

export async function fetchSalesHistory(limit = 30): Promise<SaleHistoryItem[]> {
  const [salesRes, couponsRes, statsRes] = await Promise.all([
    supabase.from('sales').select('id, order_amount, sale_date, credit_generated, coupon_id, ambassador_id').order('sale_date', { ascending: false }).limit(limit),
    supabase.from('coupons').select('id, code'),
    supabase.from('ambassador_stats').select('id, name, level'),
  ]);

  const couponById = new Map((couponsRes.data ?? []).map((c) => [c.id, c.code]));
  const ambById = new Map((statsRes.data ?? []).map((a) => [a.id!, a]));

  return (salesRes.data ?? []).map((s) => {
    const amb = ambById.get(s.ambassador_id);
    return {
      id: s.id,
      value: Number(s.order_amount),
      date: s.sale_date,
      code: couponById.get(s.coupon_id) ?? '—',
      ambassadorName: amb?.name ?? '—',
      credit: Number(s.credit_generated),
      level: amb?.level ?? 'nano',
    };
  });
}

export type SaleCalc = { tierName: string; ratePct: number; credit: number };

export function calcSaleCredit(rules: CreditRules, coupon: CouponWithAmbassador, orderAmount: number): SaleCalc {
  const tiers = performanceTiers(rules);
  const tier = currentTierFor(tiers, coupon.salesCount30d, monthsActiveSince(coupon.joinedAt));
  const ratePct = tier?.credit_pct ?? 20;
  return { tierName: tier?.name ?? 'Base', ratePct, credit: Math.round(orderAmount * (ratePct / 100)) };
}

export async function recordSale(
  brandId: string,
  coupon: CouponWithAmbassador,
  orderAmount: number,
  saleDate: string,
  calc: SaleCalc,
) {
  const { error: saleError } = await supabase.from('sales').insert({
    brand_id: brandId,
    ambassador_id: coupon.ambassadorId,
    coupon_id: coupon.couponId,
    sale_date: saleDate,
    order_amount: orderAmount,
    credit_generated: calc.credit,
  });
  if (saleError) return { error: saleError };

  const { error: ledgerError } = await supabase.from('credit_ledger').insert({
    brand_id: brandId,
    ambassador_id: coupon.ambassadorId,
    source: 'sale',
    amount: calc.credit,
  });
  return { error: ledgerError };
}
