export type Tier = 'nano' | 'micro' | 'macro';

export const TIER_LABEL_STYLE: Record<Tier, { bg: string; fg: string }> = {
  nano: { bg: '#efe7dc', fg: '#8c8078' },
  micro: { bg: '#f7dbe0', fg: '#b45f6c' },
  macro: { bg: '#3a332e', fg: '#f4c3cc' },
};

export function initials(name: string): string {
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}
