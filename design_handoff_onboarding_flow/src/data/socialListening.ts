export type MentionKind = 'embaixadora' | 'organica';

export type Mention = {
  handle: string;
  initials: string;
  avatarBg: string;
  platform: string;
  type: string;
  kind: MentionKind;
  time: string;
  reach: string;
  likes: string;
  eng: string;
  caption: string;
};

export const MENTIONS: Mention[] = [
  {
    handle: '@marinaduarte', initials: 'MD', avatarBg: '#c98a94', platform: 'Instagram', type: 'Reels', kind: 'embaixadora', time: '2h',
    reach: '48,2k', likes: '3.104', eng: '6,4%', caption: 'Provando o novo vestido Áurea da @niya.oficial — cupom MARINA10 fixado. Amei o caimento!',
  },
  {
    handle: '@paulaverano', initials: 'PV', avatarBg: '#8fa88a', platform: 'Instagram', type: 'Story', kind: 'organica', time: '4h',
    reach: '12,7k', likes: '—', eng: '8,1%', caption: 'Marcaram vocês! Chegou meu pedido da @niya.oficial e tô apaixonada 🤍',
  },
  {
    handle: '@tici.lima', initials: 'TL', avatarBg: '#c2917a', platform: 'TikTok', type: 'Vídeo', kind: 'organica', time: '6h',
    reach: '96,4k', likes: '11.2k', eng: '9,3%', caption: 'get ready with me usando @niya.oficial do começo ao fim — link na bio',
  },
  {
    handle: '@biarocha', initials: 'BR', avatarBg: '#b5a07f', platform: 'Instagram', type: 'Post', kind: 'embaixadora', time: '9h',
    reach: '21,0k', likes: '1.870', eng: '5,2%', caption: 'Carrossel novo com o conjunto Brisa da @niya.oficial · cupom BIA10',
  },
];

export const MENTION_TAG: Record<MentionKind, { tag: string; bg: string; fg: string }> = {
  embaixadora: { tag: 'Embaixadora', bg: '#efdce0', fg: '#b45f6c' },
  organica: { tag: 'Descoberta', bg: '#e3efe1', fg: '#5a8f6a' },
};
