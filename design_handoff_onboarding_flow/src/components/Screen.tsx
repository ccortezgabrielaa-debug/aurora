import type { ReactNode } from 'react';
import styles from './Screen.module.css';

/** Mobile-first single-column app viewport. Centers as a card on wider screens. */
export function Screen({ children }: { children: ReactNode }) {
  return (
    <div className={styles.stage}>
      <div className={styles.frame}>{children}</div>
    </div>
  );
}
