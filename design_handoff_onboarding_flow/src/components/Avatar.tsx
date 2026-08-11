import styles from './Avatar.module.css';

type AvatarProps = {
  initials: string;
  bg: string;
  size?: number;
  statusColor?: string;
};

export function Avatar({ initials, bg, size = 42, statusColor }: AvatarProps) {
  return (
    <div className={styles.wrap} style={{ width: size, height: size }}>
      <div
        className={styles.circle}
        style={{ background: bg, fontSize: Math.round(size * 0.36) }}
      >
        {initials}
      </div>
      {statusColor && <span className={styles.dot} style={{ background: statusColor }} />}
    </div>
  );
}
