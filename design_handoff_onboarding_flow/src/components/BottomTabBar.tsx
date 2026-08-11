import styles from './BottomTabBar.module.css';
import type { TabDef } from '../data/dashboardData';

type BottomTabBarProps = {
  tabs: TabDef[];
  active: string;
  onChange: (label: string) => void;
};

export function BottomTabBar({ tabs, active, onChange }: BottomTabBarProps) {
  return (
    <nav className={styles.bar} aria-label="Navegação principal">
      {tabs.map((t) => (
        <button
          key={t.label}
          type="button"
          className={styles.tab}
          data-active={t.label === active || undefined}
          onClick={() => onChange(t.label)}
        >
          <span className={styles.icon} aria-hidden="true">
            {t.icon}
          </span>
          <span className={styles.label}>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
