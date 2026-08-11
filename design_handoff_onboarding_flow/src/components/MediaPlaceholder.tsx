import type { CSSProperties } from 'react';

type MediaPlaceholderProps = {
  label?: string;
  radius?: number;
  style?: CSSProperties;
  badge?: string;
};

/**
 * Stand-in for the design tool's `<image-slot>` (a prototype-only component with its own
 * persistence sidecar, not available outside that runtime) — a neutral placeholder tile for
 * media that would come from Instagram/TikTok capture or a product photo in production.
 */
export function MediaPlaceholder({ label, radius = 12, style, badge }: MediaPlaceholderProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: radius,
        background: '#ece4da',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        ...style,
      }}
    >
      {label && (
        <span
          style={{
            font: '600 10px var(--au-font-text)',
            letterSpacing: '.3px',
            color: '#a89b90',
            textAlign: 'center',
            padding: '0 6px',
          }}
        >
          {label}
        </span>
      )}
      {badge && (
        <span
          style={{
            position: 'absolute',
            top: 6,
            left: 6,
            font: '600 8px var(--au-font-text)',
            letterSpacing: '.3px',
            textTransform: 'uppercase',
            padding: '2px 6px',
            borderRadius: 6,
            background: 'rgba(28,26,24,.72)',
            color: '#fff',
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}
