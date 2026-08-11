import { IconButton } from './IconButton';

type BackHeaderProps = {
  onBack: () => void;
  title: string;
};

/** Plain light header: rounded-square back button + page title, used by "new" / detail sub-screens. */
export function BackHeader({ onBack, title }: BackHeaderProps) {
  return (
    <div style={{ flex: 'none', padding: '14px 22px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconButton variant="light" ariaLabel="Voltar" onClick={onBack}>
        ‹
      </IconButton>
      <div style={{ font: "700 18px var(--au-font-display)", color: 'var(--au-ink)' }}>{title}</div>
    </div>
  );
}
