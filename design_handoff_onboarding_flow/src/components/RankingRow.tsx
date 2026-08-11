import styles from './RankingRow.module.css';
import { initials, TIER_STYLE, type Ambassador } from '../data/dashboardData';

type RankingRowProps = {
  rank: number;
  ambassador: Ambassador;
};

export function RankingRow({ rank, ambassador }: RankingRowProps) {
  const tier = TIER_STYLE[ambassador.tier];
  return (
    <div className={styles.row}>
      <div className={styles.rank}>{rank}</div>
      <div className={styles.avatar} style={{ background: ambassador.avatarBg }}>
        {initials(ambassador.name)}
      </div>
      <div className={styles.body}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{ambassador.name}</span>
          <span className={styles.tier} style={{ background: tier.bg, color: tier.fg }}>
            {tier.label}
          </span>
        </div>
        <div className={styles.sub}>
          {ambassador.handle} · {ambassador.gmv} GMV
        </div>
      </div>
      <div className={styles.scoreWrap}>
        <div className={styles.score}>{ambassador.score}</div>
        <div className={styles.scoreLabel}>pts</div>
      </div>
    </div>
  );
}
