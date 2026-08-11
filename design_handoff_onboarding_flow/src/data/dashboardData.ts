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

const EMPTY_KPIS: PeriodKpis = {
  ativas: '0',
  ativasDelta: '0',
  gmv: 'R$ 0',
  gmvDelta: '0%',
  resgate: '0%',
  conv: '0%',
  budgetUsed: 'R$ 0',
  budgetCap: 'R$ 0',
  budgetPct: '0%',
};

export const PERIOD_DATA: Record<Period, PeriodKpis> = {
  '7d': { ...EMPTY_KPIS },
  '30d': { ...EMPTY_KPIS },
  '90d': { ...EMPTY_KPIS },
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

export const RANKING: Ambassador[] = [];

export const TIER_STYLE: Record<Tier, { bg: string; fg: string; label: string }> = {
  nano: { bg: 'var(--au-tier-nano-bg)', fg: 'var(--au-tier-nano-fg)', label: 'nano' },
  micro: { bg: 'var(--au-tier-micro-bg)', fg: 'var(--au-tier-micro-fg)', label: 'micro' },
  macro: { bg: 'var(--au-tier-macro-bg)', fg: 'var(--au-tier-macro-fg)', label: 'macro' },
};

export function initials(name: string): string {
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}
