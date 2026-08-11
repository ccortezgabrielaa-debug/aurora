type StatusBadgeProps = {
  label: string;
  bg: string;
  fg: string;
  size?: 'sm' | 'md';
};

export function StatusBadge({ label, bg, fg, size = 'sm' }: StatusBadgeProps) {
  return (
    <span
      style={{
        font: `600 ${size === 'sm' ? '8px' : '8.5px'} var(--au-font-text)`,
        letterSpacing: '.3px',
        textTransform: 'uppercase',
        padding: size === 'sm' ? '2px 6px' : '2px 7px',
        borderRadius: 6,
        color: fg,
        background: bg,
        flex: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}
