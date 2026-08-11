// The schema stores no per-ambassador avatar color, so we derive a stable one from
// their id/handle — same palette used throughout the mockups for ambassador avatars.
const PALETTE = ['#c98a94', '#b5a07f', '#8fa88a', '#c2917a', '#9a8fb0', '#a88f6a', '#7fa0a8', '#b08a9a'];

export function avatarColorFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}
