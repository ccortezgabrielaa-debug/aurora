import type { ReactNode } from 'react';
import styles from './ListHeader.module.css';

type ListHeaderProps = {
  kicker: string;
  title: string;
  right?: ReactNode;
  children?: ReactNode;
};

/** Kicker + title + optional right-side action, used atop list/feed screens. */
export function ListHeader({ kicker, title, right, children }: ListHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div>
          <div className={styles.kicker}>{kicker}</div>
          <h1 className={styles.title}>{title}</h1>
        </div>
        {right}
      </div>
      {children && <div className={styles.rest}>{children}</div>}
    </header>
  );
}
