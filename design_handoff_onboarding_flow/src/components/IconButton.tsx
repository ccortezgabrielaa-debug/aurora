import type { ReactNode } from 'react';

type IconButtonProps = {
  onClick?: () => void;
  children: ReactNode;
  variant?: 'accent' | 'light' | 'dark';
  size?: number;
  ariaLabel: string;
};

const VARIANT_STYLE: Record<NonNullable<IconButtonProps['variant']>, React.CSSProperties> = {
  accent: { background: 'var(--au-rose)', color: 'var(--au-ink)', border: 0 },
  light: { background: 'var(--au-sand)', color: 'var(--au-ink)', border: 0 },
  dark: { background: 'rgba(255,255,255,.12)', color: '#fff', border: 0 },
};

/** Rounded-square icon button — "+" add actions and back buttons across list/detail headers. */
export function IconButton({ onClick, children, variant = 'light', size = 40, ariaLabel }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width: size,
        height: size,
        borderRadius: 13,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Math.round(size * 0.45),
        cursor: 'pointer',
        flex: 'none',
        padding: 0,
        ...VARIANT_STYLE[variant],
      }}
    >
      {children}
    </button>
  );
}
