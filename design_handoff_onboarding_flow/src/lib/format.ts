export function formatBRL(value: number): string {
  if (value >= 1000) {
    return 'R$ ' + (value / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + 'k';
  }
  return 'R$ ' + Math.round(value).toLocaleString('pt-BR');
}

export function formatBRLFull(value: number): string {
  return 'R$ ' + Math.round(value).toLocaleString('pt-BR');
}

export function formatPct(value: number | null, digits = 0): string {
  if (value === null) return '—';
  return value.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits }) + '%';
}

export function formatDelta(value: number): string {
  return (value >= 0 ? '+' : '') + value;
}

export function formatDeltaPct(value: number | null): string {
  if (value === null) return '—';
  return (value >= 0 ? '+' : '') + Math.round(value) + '%';
}
