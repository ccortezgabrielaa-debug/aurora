export type CouponStatus = 'ativo' | 'pausado';
export type AmbassadorTier = 'Nano' | 'Micro' | 'Macro';

export type Coupon = {
  code: string;
  name: string;
  shop: string;
  status: CouponStatus;
  uses: number;
  tier: AmbassadorTier;
  rate: number;
};

export const COUPONS: Coupon[] = [
  { code: 'MARINA10', name: 'Marina Duarte', shop: 'niya.myshopify.com', status: 'ativo', uses: 214, tier: 'Macro', rate: 0.1 },
  { code: 'BIA10', name: 'Bia Rocha', shop: 'niya.myshopify.com', status: 'ativo', uses: 98, tier: 'Micro', rate: 0.08 },
  { code: 'CLARA10', name: 'Clara Nunes', shop: 'niya.myshopify.com', status: 'ativo', uses: 76, tier: 'Micro', rate: 0.08 },
  { code: 'DUDA10', name: 'Duda Freitas', shop: 'niya.myshopify.com', status: 'pausado', uses: 41, tier: 'Nano', rate: 0.06 },
  { code: 'HELENA10', name: 'Helena Sá', shop: 'niya.myshopify.com', status: 'pausado', uses: 12, tier: 'Nano', rate: 0.06 },
];

export type SaleHistoryEntry = {
  value: string;
  date: string;
  code: string;
  name: string;
  credit: string;
  rate: string;
  tier: AmbassadorTier;
};

export const SALES_HISTORY: SaleHistoryEntry[] = [
  { value: 'R$ 890', date: '08 ago', code: 'MARINA10', name: 'Marina', credit: 'R$ 89', rate: '10%', tier: 'Macro' },
  { value: 'R$ 540', date: '07 ago', code: 'BIA10', name: 'Bia', credit: 'R$ 43', rate: '8%', tier: 'Micro' },
  { value: 'R$ 1.240', date: '05 ago', code: 'MARINA10', name: 'Marina', credit: 'R$ 124', rate: '10%', tier: 'Macro' },
  { value: 'R$ 320', date: '06 ago', code: 'CLARA10', name: 'Clara', credit: 'R$ 26', rate: '8%', tier: 'Micro' },
  { value: 'R$ 280', date: '05 ago', code: 'DUDA10', name: 'Duda', credit: 'R$ 17', rate: '6%', tier: 'Nano' },
  { value: 'R$ 640', date: '01 ago', code: 'MARINA10', name: 'Marina', credit: 'R$ 64', rate: '10%', tier: 'Macro' },
];

export function parseAmount(v: string): number {
  const n = parseFloat(v.replace(/\./g, '').replace(',', '.'));
  return isNaN(n) ? 0 : n;
}

export function brl(n: number): string {
  return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export const COUPON_STATUS_DOT: Record<CouponStatus, string> = {
  ativo: '#5aa06a',
  pausado: '#c3b8ac',
};
