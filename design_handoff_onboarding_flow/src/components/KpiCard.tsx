import styles from './KpiCard.module.css';

type KpiCardProps = {
  label: string;
  value: string;
  caption: string;
  tone: 'up' | 'muted';
  size?: 'lg' | 'sm';
};

export function KpiCard({ label, value, caption, tone, size = 'lg' }: KpiCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value} data-size={size === 'sm' ? 'sm' : undefined}>
        {value}
      </div>
      <div className={styles.delta} data-tone={tone}>
        {caption}
      </div>
    </div>
  );
}
