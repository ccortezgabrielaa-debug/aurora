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

export const PERIOD_LABELS: Record<Period, string> = {
  '7d': '7 dias',
  '30d': '30 dias',
  '90d': '90 dias',
};
