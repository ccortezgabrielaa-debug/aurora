export type Tier = 'nano' | 'micro' | 'macro';
export type AmbassadorStatus = 'ativa' | 'inativa';
export type ContentStatus = 'aprovado' | 'pendente' | 'rejeitado';
export type LedgerStatus = 'ativo' | 'resgatado' | 'expirado';

export type SaleEntry = { date: string; value: string; credit: string };
export type ContentEntry = { type: string; status: ContentStatus; credit: string; date: string; days: number };
export type LedgerEntry = { source: string; date: string; expiry: string; value: string; status: LedgerStatus };

export type AmbassadorRecord = {
  name: string;
  handle: string;
  tier: Tier;
  status: AmbassadorStatus;
  coupon: string;
  score: number;
  gmv: string;
  balance: string;
  avatarBg: string;
  sales: SaleEntry[];
  content: ContentEntry[];
  ledger: LedgerEntry[];
};

export const TIER_LABEL_STYLE: Record<Tier, { bg: string; fg: string }> = {
  nano: { bg: '#efe7dc', fg: '#8c8078' },
  micro: { bg: '#f7dbe0', fg: '#b45f6c' },
  macro: { bg: '#3a332e', fg: '#f4c3cc' },
};

export const CONTENT_STATUS_STYLE: Record<ContentStatus, { bg: string; fg: string }> = {
  aprovado: { bg: '#e3efe1', fg: '#5a8f6a' },
  pendente: { bg: '#f6ecd6', fg: '#b08a3a' },
  rejeitado: { bg: '#f6dcd8', fg: '#c05a4e' },
};

export const LEDGER_STATUS_STYLE: Record<LedgerStatus, { fg: string }> = {
  ativo: { fg: '#5a8f6a' },
  resgatado: { fg: '#8c8078' },
  expirado: { fg: '#c05a4e' },
};

export function initials(name: string): string {
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

export function ledgerValueColor(value: string): string {
  return value.trim().startsWith('-') ? '#c05a4e' : '#5a8f6a';
}

export const AMBASSADORS: AmbassadorRecord[] = [
  {
    name: 'Marina Duarte',
    handle: '@marinaduarte',
    tier: 'macro',
    status: 'ativa',
    coupon: 'MARINA10',
    score: 948,
    gmv: 'R$ 61,4k',
    balance: 'R$ 1.240',
    avatarBg: '#c98a94',
    sales: [
      { date: '08 ago', value: 'R$ 890', credit: 'R$ 89' },
      { date: '05 ago', value: 'R$ 1.240', credit: 'R$ 124' },
      { date: '01 ago', value: 'R$ 640', credit: 'R$ 64' },
      { date: '28 jul', value: 'R$ 2.100', credit: 'R$ 210' },
    ],
    content: [
      { type: 'Reels', status: 'aprovado', credit: 'R$ 120', date: '07 ago', days: 34 },
      { type: 'Story', status: 'aprovado', credit: 'R$ 40', date: '04 ago', days: 37 },
      { type: 'Post', status: 'pendente', credit: 'R$ 0', date: '09 ago', days: 1 },
    ],
    ledger: [
      { source: 'Venda MARINA10', date: '08 ago', expiry: 'expira 07 nov', value: '+ R$ 89', status: 'ativo' },
      { source: 'Reels aprovado', date: '07 ago', expiry: 'expira 06 nov', value: '+ R$ 120', status: 'ativo' },
      { source: 'Resgate — Vestido Áurea', date: '02 ago', expiry: '—', value: '- R$ 380', status: 'resgatado' },
      { source: 'Story', date: '12 jul', expiry: 'expirado', value: '+ R$ 40', status: 'expirado' },
    ],
  },
  {
    name: 'Bia Rocha',
    handle: '@biarocha',
    tier: 'micro',
    status: 'ativa',
    coupon: 'BIA10',
    score: 812,
    gmv: 'R$ 34,7k',
    balance: 'R$ 690',
    avatarBg: '#b5a07f',
    sales: [
      { date: '07 ago', value: 'R$ 540', credit: 'R$ 43' },
      { date: '03 ago', value: 'R$ 820', credit: 'R$ 66' },
      { date: '30 jul', value: 'R$ 410', credit: 'R$ 33' },
    ],
    content: [
      { type: 'Story', status: 'aprovado', credit: 'R$ 40', date: '06 ago', days: 12 },
      { type: 'Post', status: 'aprovado', credit: 'R$ 80', date: '02 ago', days: 16 },
    ],
    ledger: [
      { source: 'Venda BIA10', date: '07 ago', expiry: 'expira 06 nov', value: '+ R$ 43', status: 'ativo' },
      { source: 'Post aprovado', date: '02 ago', expiry: 'expira 01 nov', value: '+ R$ 80', status: 'ativo' },
    ],
  },
  {
    name: 'Clara Nunes',
    handle: '@claranunes',
    tier: 'micro',
    status: 'ativa',
    coupon: 'CLARA10',
    score: 733,
    gmv: 'R$ 28,1k',
    balance: 'R$ 415',
    avatarBg: '#8fa88a',
    sales: [
      { date: '06 ago', value: 'R$ 320', credit: 'R$ 26' },
      { date: '29 jul', value: 'R$ 700', credit: 'R$ 56' },
    ],
    content: [
      { type: 'Reels', status: 'pendente', credit: 'R$ 0', date: '08 ago', days: 2 },
      { type: 'Story', status: 'aprovado', credit: 'R$ 40', date: '01 ago', days: 14 },
    ],
    ledger: [
      { source: 'Venda CLARA10', date: '06 ago', expiry: 'expira 05 nov', value: '+ R$ 26', status: 'ativo' },
      { source: 'Story aprovado', date: '01 ago', expiry: 'expira 31 out', value: '+ R$ 40', status: 'ativo' },
    ],
  },
  {
    name: 'Duda Freitas',
    handle: '@dudafreitas',
    tier: 'nano',
    status: 'ativa',
    coupon: 'DUDA10',
    score: 611,
    gmv: 'R$ 19,9k',
    balance: 'R$ 210',
    avatarBg: '#c2917a',
    sales: [
      { date: '05 ago', value: 'R$ 280', credit: 'R$ 22' },
      { date: '27 jul', value: 'R$ 350', credit: 'R$ 28' },
    ],
    content: [
      { type: 'Story', status: 'rejeitado', credit: 'R$ 0', date: '04 ago', days: 0 },
      { type: 'Story', status: 'aprovado', credit: 'R$ 40', date: '28 jul', days: 18 },
    ],
    ledger: [{ source: 'Venda DUDA10', date: '05 ago', expiry: 'expira 04 nov', value: '+ R$ 22', status: 'ativo' }],
  },
  {
    name: 'Helena Sá',
    handle: '@helenasa',
    tier: 'nano',
    status: 'inativa',
    coupon: 'HELENA10',
    score: 540,
    gmv: 'R$ 14,3k',
    balance: 'R$ 95',
    avatarBg: '#9a8fb0',
    sales: [{ date: '20 jul', value: 'R$ 190', credit: 'R$ 15' }],
    content: [{ type: 'Post', status: 'aprovado', credit: 'R$ 80', date: '18 jul', days: 23 }],
    ledger: [{ source: 'Post aprovado', date: '18 jul', expiry: 'expira 17 out', value: '+ R$ 80', status: 'ativo' }],
  },
  {
    name: 'Lorena Pires',
    handle: '@lorenapires',
    tier: 'micro',
    status: 'inativa',
    coupon: 'LORENA10',
    score: 388,
    gmv: 'R$ 9,7k',
    balance: 'R$ 0',
    avatarBg: '#a88f6a',
    sales: [{ date: '02 jul', value: 'R$ 220', credit: 'R$ 18' }],
    content: [{ type: 'Story', status: 'aprovado', credit: 'R$ 40', date: '30 jun', days: 41 }],
    ledger: [
      { source: 'Resgate — Kit Verão', date: '10 jul', expiry: '—', value: '- R$ 300', status: 'resgatado' },
      { source: 'Story', date: '01 mai', expiry: 'expirado', value: '+ R$ 40', status: 'expirado' },
    ],
  },
];
