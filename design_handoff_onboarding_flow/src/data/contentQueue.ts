export type ContentQueueStatus = 'monitorando' | 'validado' | 'removido' | 'revisar';

export type ContentQueueItem = {
  name: string;
  initials: string;
  avatarBg: string;
  coupon: string;
  type: string;
  date: string;
  credit: string;
  cat: 'feed' | 'story';
  reqLabel: string;
  elapsedLabel: string;
  pct: number;
  status: ContentQueueStatus;
  caption: string;
  brand: boolean;
  couponOk: boolean;
  connected: boolean;
};

export const CONTENT_QUEUE: ContentQueueItem[] = [
  {
    name: 'Marina Duarte', initials: 'MD', avatarBg: '#c98a94', coupon: 'MARINA10', type: 'Reels', date: '09 jul',
    credit: '120', cat: 'feed', reqLabel: '30 dias no feed', elapsedLabel: '30 de 30 dias', pct: 100, status: 'validado',
    caption: 'Look completo com vestido Áurea, cupom fixado na legenda e story vinculado.', brand: true, couponOk: true, connected: true,
  },
  {
    name: 'Clara Nunes', initials: 'CN', avatarBg: '#8fa88a', coupon: 'CLARA10', type: 'Story', date: 'hoje 08:12',
    credit: '40', cat: 'story', reqLabel: '24h no ar', elapsedLabel: '18h de 24h', pct: 75, status: 'monitorando',
    caption: 'Sequência de 3 stories no provador, cupom no último frame.', brand: true, couponOk: true, connected: true,
  },
  {
    name: 'Duda Freitas', initials: 'DF', avatarBg: '#c2917a', coupon: 'DUDA10', type: 'Post', date: '28 jul',
    credit: '80', cat: 'feed', reqLabel: '30 dias no feed', elapsedLabel: '12 de 30 dias', pct: 40, status: 'monitorando',
    caption: 'Carrossel editorial com 4 fotos, marca e cupom na legenda.', brand: true, couponOk: true, connected: true,
  },
  {
    name: 'Bia Rocha', initials: 'BR', avatarBg: '#b5a07f', coupon: 'BIA10', type: 'Story', date: '06 ago',
    credit: '40', cat: 'story', reqLabel: '24h no ar', elapsedLabel: 'removido em 6h', pct: 25, status: 'removido',
    caption: 'Story removido antes de completar 24h — crédito não liberado.', brand: true, couponOk: true, connected: true,
  },
  {
    name: 'Helena Sá', initials: 'HS', avatarBg: '#9a8fb0', coupon: 'HELENA10', type: 'Reels', date: 'hoje 10:40',
    credit: '120', cat: 'feed', reqLabel: '30 dias no feed', elapsedLabel: 'marca não identificada', pct: 8, status: 'revisar',
    caption: 'Reels detectado, mas a marca @aurora.studio não foi marcada — precisa de revisão manual.', brand: false, couponOk: true, connected: true,
  },
];

export const CONTENT_STATUS_META: Record<ContentQueueStatus, { label: string; bg: string; fg: string; bar: string }> = {
  validado: { label: 'Validado', bg: '#e3efe1', fg: '#5a8f6a', bar: '#5a8f6a' },
  monitorando: { label: 'Monitorando', bg: '#f6ecd6', fg: '#b08a3a', bar: '#c67d88' },
  removido: { label: 'Removido', bg: '#f6dcd8', fg: '#c05a4e', bar: '#c05a4e' },
  revisar: { label: 'Revisar', bg: '#e7e0f0', fg: '#7a6ca0', bar: '#9a8fb0' },
};
