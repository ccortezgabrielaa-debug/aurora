export type Period = '7d' | '30d' | '90d';

export type TabDef = {
  label: string;
  icon: string;
};

export const DASHBOARD_TABS: TabDef[] = [
  { label: 'Início', icon: '⌂' },
  { label: 'Embaixadoras', icon: '◍' },
  { label: 'Conteúdo', icon: '▤' },
  { label: 'Crédito', icon: '◈' },
];

export type PeriodKpis = {
  ativas: string;
  ativasDelta: string;
  gmv: string;
  gmvDelta: string;
  resgate: string;
  conv: string;
  budgetUsed: string;
  budgetCap: string;
  budgetPct: string;
};

export const PERIOD_LABELS: Record<Period, string> = {
  '7d': '7 dias',
  '30d': '30 dias',
  '90d': '90 dias',
};

export const PERIOD_DATA: Record<Period, PeriodKpis> = {
  '7d': {
    ativas: '24',
    ativasDelta: '+3',
    gmv: 'R$ 38,2k',
    gmvDelta: '+12%',
    resgate: '54%',
    conv: '31%',
    budgetUsed: 'R$ 1.180',
    budgetCap: 'R$ 4.000',
    budgetPct: '30%',
  },
  '30d': {
    ativas: '31',
    ativasDelta: '+7',
    gmv: 'R$ 142,6k',
    gmvDelta: '+23%',
    resgate: '61%',
    conv: '38%',
    budgetUsed: 'R$ 5.240',
    budgetCap: 'R$ 16.000',
    budgetPct: '33%',
  },
  '90d': {
    ativas: '38',
    ativasDelta: '+14',
    gmv: 'R$ 402,9k',
    gmvDelta: '+41%',
    resgate: '58%',
    conv: '35%',
    budgetUsed: 'R$ 14.900',
    budgetCap: 'R$ 48.000',
    budgetPct: '31%',
  },
};

export type Tier = 'nano' | 'micro' | 'macro';

export type Ambassador = {
  name: string;
  handle: string;
  tier: Tier;
  score: number;
  gmv: string;
  avatarBg: string;
};

export const RANKING: Ambassador[] = [
  { name: 'Marina Duarte', handle: '@marinaduarte', tier: 'macro', score: 948, gmv: 'R$ 61,4k', avatarBg: '#c98a94' },
  { name: 'Bia Rocha', handle: '@biarocha', tier: 'micro', score: 812, gmv: 'R$ 34,7k', avatarBg: '#b5a07f' },
  { name: 'Clara Nunes', handle: '@claranunes', tier: 'micro', score: 733, gmv: 'R$ 28,1k', avatarBg: '#8fa88a' },
  { name: 'Duda Freitas', handle: '@dudafreitas', tier: 'nano', score: 611, gmv: 'R$ 19,9k', avatarBg: '#c2917a' },
  { name: 'Helena Sá', handle: '@helenasa', tier: 'nano', score: 540, gmv: 'R$ 14,3k', avatarBg: '#9a8fb0' },
];

export const TIER_STYLE: Record<Tier, { bg: string; fg: string; label: string }> = {
  nano: { bg: 'var(--au-tier-nano-bg)', fg: 'var(--au-tier-nano-fg)', label: 'nano' },
  micro: { bg: 'var(--au-tier-micro-bg)', fg: 'var(--au-tier-micro-fg)', label: 'micro' },
  macro: { bg: 'var(--au-tier-macro-bg)', fg: 'var(--au-tier-macro-fg)', label: 'macro' },
};

export function initials(name: string): string {
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}
