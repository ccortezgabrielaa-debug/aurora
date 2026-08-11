import type { ReactNode } from 'react';
import { IconButton } from './IconButton';
import styles from './DarkPanelHeader.module.css';

type DarkPanelHeaderProps = {
  children: ReactNode;
};

/** Rounded-bottom dark panel wrapper used by profile/detail headers (Embaixadoras, Crédito, Conteúdo). */
export function DarkPanelHeader({ children }: DarkPanelHeaderProps) {
  return <div className={styles.panel}>{children}</div>;
}

type BackRowProps = {
  onBack: () => void;
  backLabel: string;
  title?: string;
  right?: ReactNode;
};

/** Back button + centered uppercase title row, used at the top of dark detail panels. */
export function BackRow({ onBack, backLabel, title, right }: BackRowProps) {
  return (
    <div className={styles.topRow}>
      <IconButton variant="dark" ariaLabel={backLabel} onClick={onBack}>
        ‹
      </IconButton>
      {title && <div className={styles.title}>{title}</div>}
      {right ?? <div style={{ width: 38 }} />}
    </div>
  );
}
