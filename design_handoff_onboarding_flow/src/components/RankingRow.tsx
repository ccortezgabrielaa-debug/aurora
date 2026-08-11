import styles from './RankingRow.module.css';
import { initials, TIER_LABEL_STYLE, type Tier } from '../data/ambassadors';
import { avatarColorFor } from '../lib/avatarColor';

type RankingRowProps = {
  rank: number;
  id: string;
  name: string;
  handle: string | null;
  tier: Tier;
  score: number;
  gmvLabel: string;
};

export function RankingRow({ rank, id, name, handle, tier, score, gmvLabel }: RankingRowProps) {
  const t = TIER_LABEL_STYLE[tier];
  return (
    <div className={styles.row}>
      <div className={styles.rank}>{rank}</div>
      <div className={styles.avatar} style={{ background: avatarColorFor(id) }}>
        {initials(name)}
      </div>
      <div className={styles.body}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{name}</span>
          <span className={styles.tier} style={{ background: t.bg, color: t.fg }}>
            {tier}
          </span>
        </div>
        <div className={styles.sub}>
          {handle ?? '—'} · {gmvLabel} GMV
        </div>
      </div>
      <div className={styles.scoreWrap}>
        <div className={styles.score}>{score}</div>
        <div className={styles.scoreLabel}>pts</div>
      </div>
    </div>
  );
}
