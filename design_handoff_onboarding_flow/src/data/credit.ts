export type RedemptionStatus = 'solicitado' | 'enviado' | 'recusado';

export type Redemption = {
  name: string;
  initials: string;
  avatarBg: string;
  balance: string;
  product: string;
  variant: string;
  cost: string;
  prodCost: string;
  date: string;
  status: RedemptionStatus;
  afterBalance: string;
  address: string;
};

export const REDEMPTIONS: Redemption[] = [
  {
    name: 'Marina Duarte', initials: 'MD', avatarBg: '#c98a94', balance: 'R$ 1.240', product: 'Vestido Áurea',
    variant: 'Tam. M · Areia', cost: 'R$ 380', prodCost: 'R$ 148', date: 'hoje 09:10', status: 'solicitado',
    afterBalance: 'R$ 860', address: 'R. das Laranjeiras, 210 · ap 72\nJardins, São Paulo — SP · 01423-000',
  },
  {
    name: 'Bia Rocha', initials: 'BR', avatarBg: '#b5a07f', balance: 'R$ 690', product: 'Conjunto Brisa',
    variant: 'Tam. P · Off-white', cost: 'R$ 320', prodCost: 'R$ 121', date: 'ontem', status: 'solicitado',
    afterBalance: 'R$ 370', address: 'Av. Beira-Mar, 1180 · bl B\nMeireles, Fortaleza — CE · 60165-121',
  },
  {
    name: 'Clara Nunes', initials: 'CN', avatarBg: '#8fa88a', balance: 'R$ 415', product: 'Blusa Linho Solar',
    variant: 'Tam. M · Terracota', cost: 'R$ 210', prodCost: 'R$ 79', date: '07 ago', status: 'enviado',
    afterBalance: 'R$ 205', address: 'R. Padre Chagas, 88\nMoinhos de Vento, Porto Alegre — RS · 90570-080',
  },
  {
    name: 'Lorena Pires', initials: 'LP', avatarBg: '#a88f6a', balance: 'R$ 300', product: 'Kit Verão (2 peças)',
    variant: 'Tam. P', cost: 'R$ 300', prodCost: 'R$ 112', date: '02 ago', status: 'enviado',
    afterBalance: 'R$ 0', address: 'R. Oscar Freire, 500 · ap 34\nCerqueira César, São Paulo — SP · 01426-001',
  },
];

export const REDEMPTION_STATUS_META: Record<RedemptionStatus, { label: string; bg: string; fg: string }> = {
  solicitado: { label: 'Solicitado', bg: '#f6ecd6', fg: '#b08a3a' },
  enviado: { label: 'Enviado', bg: '#e3efe1', fg: '#5a8f6a' },
  recusado: { label: 'Recusado', bg: '#f6dcd8', fg: '#c05a4e' },
};

export type LedgerKind = 'in' | 'out' | 'exp';

export type LedgerEntry = {
  icon: string;
  kind: LedgerKind;
  title: string;
  who: string;
  date: string;
  value: string;
};

export const LEDGER: LedgerEntry[] = [
  { icon: '↑', kind: 'in', title: 'Venda MARINA10', who: 'Marina Duarte', date: 'hoje', value: '+ R$ 89' },
  { icon: '✓', kind: 'in', title: 'Reels validado', who: 'Marina Duarte', date: 'hoje', value: '+ R$ 120' },
  { icon: '↓', kind: 'out', title: 'Resgate · Blusa Linho Solar', who: 'Clara Nunes', date: '07 ago', value: '- R$ 210' },
  { icon: '↑', kind: 'in', title: 'Venda BIA10', who: 'Bia Rocha', date: '07 ago', value: '+ R$ 43' },
  { icon: '↓', kind: 'out', title: 'Resgate · Kit Verão', who: 'Lorena Pires', date: '02 ago', value: '- R$ 300' },
  { icon: '⤫', kind: 'exp', title: 'Crédito expirado', who: 'Helena Sá', date: '01 ago', value: '- R$ 40' },
  { icon: '✓', kind: 'in', title: 'Post validado', who: 'Bia Rocha', date: '02 ago', value: '+ R$ 80' },
];

export const LEDGER_KIND_STYLE: Record<LedgerKind, { iconBg: string; iconFg: string; valColor: string }> = {
  in: { iconBg: '#e3efe1', iconFg: '#5a8f6a', valColor: '#5a8f6a' },
  out: { iconBg: '#faf1f0', iconFg: '#c67d88', valColor: '#c05a4e' },
  exp: { iconBg: '#efe7dc', iconFg: '#a89b90', valColor: '#c05a4e' },
};

export const CREDIT_SUMMARY = { outstanding: 'R$ 3.310', issuedMonth: 'R$ 1.180', redeemedMonth: 'R$ 510' };
