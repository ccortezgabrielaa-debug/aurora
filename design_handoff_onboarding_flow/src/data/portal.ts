export const ME = {
  initials: 'MD',
  avatarBg: '#c98a94',
  firstName: 'Marina',
  level: 'Performance',
  points: 948,
  levelPct: '82%',
  coupon: 'MARINA10',
  refLink: 'niya.com.br/@marinaduarte',
  balance: 'R$ 1.240',
  salesMonth: '14',
  liveContent: '3',
  gmvMonth: 'R$ 8.940',
  creditMonth: 'R$ 612',
};

export type ActivityEntry = {
  icon: string;
  title: string;
  date: string;
  value: string;
  iconBg: string;
  iconFg: string;
  valColor: string;
};

export const ACTIVITY: ActivityEntry[] = [
  { icon: '↑', title: 'Venda MARINA10', date: 'hoje · 09:10', value: '+ R$ 89', iconBg: '#e3efe1', iconFg: '#5a8f6a', valColor: '#5a8f6a' },
  { icon: '✓', title: 'Reels validado', date: 'hoje', value: '+ R$ 120', iconBg: '#e3efe1', iconFg: '#5a8f6a', valColor: '#5a8f6a' },
  { icon: '★', title: 'Subiu 40 pontos', date: 'ontem', value: '+40 pts', iconBg: '#faf1f0', iconFg: '#c67d88', valColor: '#c67d88' },
  { icon: '↓', title: 'Resgate · Vestido Áurea', date: '02 ago', value: '- R$ 380', iconBg: '#faf1f0', iconFg: '#c67d88', valColor: '#c05a4e' },
];

export type PortalSale = { value: string; date: string; order: string; credit: string; rate: string };

export const PORTAL_SALES: PortalSale[] = [
  { value: 'R$ 890', date: '08 ago', order: '#48213', credit: 'R$ 89', rate: '10%' },
  { value: 'R$ 1.240', date: '05 ago', order: '#48090', credit: 'R$ 124', rate: '10%' },
  { value: 'R$ 640', date: '01 ago', order: '#47810', credit: 'R$ 64', rate: '10%' },
  { value: 'R$ 2.100', date: '28 jul', order: '#47502', credit: 'R$ 210', rate: '10%' },
  { value: 'R$ 520', date: '24 jul', order: '#47331', credit: 'R$ 52', rate: '10%' },
];

export type PortalContentStatus = 'aprovado' | 'pendente' | 'rejeitado';
export type PortalContent = {
  type: string;
  status: PortalContentStatus;
  credit: string;
  date: string;
  perma: string;
  pct: number;
  barColor: string;
  showBar: boolean;
};

export const PORTAL_CONTENT_STATUS_STYLE: Record<PortalContentStatus, { bg: string; fg: string }> = {
  aprovado: { bg: '#e3efe1', fg: '#5a8f6a' },
  pendente: { bg: '#f6ecd6', fg: '#b08a3a' },
  rejeitado: { bg: '#f6dcd8', fg: '#c05a4e' },
};

export const PORTAL_CONTENT: PortalContent[] = [
  { type: 'Reels', status: 'aprovado', credit: '+ R$ 120', date: '07 ago', perma: 'no feed · 34 dias no ar', pct: 100, barColor: '#5a8f6a', showBar: true },
  { type: 'Story', status: 'aprovado', credit: '+ R$ 40', date: 'hoje 08:12', perma: '18h de 24h no ar', pct: 75, barColor: '#c67d88', showBar: true },
  { type: 'Post', status: 'pendente', credit: 'em análise', date: 'hoje 10:40', perma: 'aguardando validação', pct: 15, barColor: '#b08a3a', showBar: true },
  { type: 'Story', status: 'rejeitado', credit: 'R$ 0', date: '04 ago', perma: 'cupom não visível', pct: 0, barColor: '#c05a4e', showBar: false },
];

export function portalContentCreditColor(status: PortalContentStatus): string {
  return status === 'rejeitado' ? '#b7ab9e' : status === 'pendente' ? '#b08a3a' : '#5a8f6a';
}

export type CatalogItem = { name: string; cost: string; costN: number };

export const CATALOG: CatalogItem[] = [
  { name: 'Vestido Áurea', cost: 'R$ 380', costN: 380 },
  { name: 'Conjunto Brisa', cost: 'R$ 320', costN: 320 },
  { name: 'Blusa Linho Solar', cost: 'R$ 210', costN: 210 },
  { name: 'Kit Verão', cost: 'R$ 300', costN: 300 },
];

export const PORTAL_BALANCE_N = 1240;

export type PortalLedgerStatus = 'ativo' | 'resgatado' | 'expirado';
export type PortalLedgerEntry = { source: string; date: string; expiry: string; value: string; status: PortalLedgerStatus };

export const PORTAL_LEDGER_STATUS_STYLE: Record<PortalLedgerStatus, { fg: string }> = {
  ativo: { fg: '#5a8f6a' },
  resgatado: { fg: '#8c8078' },
  expirado: { fg: '#c05a4e' },
};

export const PORTAL_LEDGER: PortalLedgerEntry[] = [
  { source: 'Venda MARINA10', date: '08 ago', expiry: 'expira 06 nov', value: '+ R$ 89', status: 'ativo' },
  { source: 'Reels validado', date: '07 ago', expiry: 'expira 05 nov', value: '+ R$ 120', status: 'ativo' },
  { source: 'Resgate · Vestido Áurea', date: '02 ago', expiry: '—', value: '- R$ 380', status: 'resgatado' },
  { source: 'Story', date: '12 jul', expiry: 'expirado', value: '+ R$ 40', status: 'expirado' },
];
