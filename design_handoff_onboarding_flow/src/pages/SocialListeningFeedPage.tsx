import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { IconButton } from '../components/IconButton';
import { FilterChips } from '../components/FilterChips';
import { Avatar } from '../components/Avatar';
import { MediaPlaceholder } from '../components/MediaPlaceholder';
import { MENTIONS, MENTION_TAG } from '../data/socialListening';
import styles from './SocialListeningFeedPage.module.css';

type Filter = 'Todas' | 'Embaixadoras' | 'Descobertas';
const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: 'Todas', label: 'Todas' },
  { value: 'Embaixadoras', label: 'Embaixadoras' },
  { value: 'Descobertas', label: 'Descobertas' },
];
const FILTER_MAP: Record<Filter, 'embaixadora' | 'organica' | null> = {
  Todas: null,
  Embaixadoras: 'embaixadora',
  Descobertas: 'organica',
};

export function SocialListeningFeedPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('Todas');

  const allowed = FILTER_MAP[filter];
  const feed = MENTIONS.filter((m) => allowed === null || m.kind === allowed);

  return (
    <Screen>
      <header className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.titleGroup}>
            <IconButton variant="light" ariaLabel="Voltar" onClick={() => navigate(-1)}>
              ‹
            </IconButton>
            <div>
              <div className={styles.kicker}>Niya · menções de @niya.oficial</div>
              <h1 className={styles.title}>Social listening</h1>
            </div>
          </div>
          <div className={styles.countWrap}>
            <div className={styles.count}>{MENTIONS.length}</div>
            <div className={styles.countLabel}>hoje</div>
          </div>
        </div>
        <div className={styles.chipsRow}>
          <FilterChips ariaLabel="Filtrar menções" options={FILTER_OPTIONS} value={filter} onChange={setFilter} fill />
        </div>
      </header>

      <div className={`au-scroll ${styles.body}`}>
        <div className={styles.list}>
          {feed.map((m, i) => {
            const tag = MENTION_TAG[m.kind];
            const idx = MENTIONS.indexOf(m);
            return (
              <button key={i} type="button" className={styles.card} onClick={() => navigate(`/social-listening/${idx}`)}>
                <div className={styles.mediaWrap}>
                  <span className={styles.platformBadge}>
                    {m.platform} · {m.type}
                  </span>
                  <span className={styles.tagBadge} style={{ background: tag.bg, color: tag.fg }}>
                    {tag.tag}
                  </span>
                  <MediaPlaceholder label="mídia capturada" radius={0} />
                </div>
                <div className={styles.cardBottom}>
                  <div className={styles.handleRow}>
                    <Avatar initials={m.initials} bg={m.avatarBg} size={26} />
                    <span className={styles.handle}>{m.handle}</span>
                    <span className={styles.time}>{m.time}</span>
                  </div>
                  <div className={styles.metricsRow}>
                    <div>
                      <div className={styles.metricValue}>{m.reach}</div>
                      <div className={styles.metricLabel}>alcance</div>
                    </div>
                    <div>
                      <div className={styles.metricValue}>{m.likes}</div>
                      <div className={styles.metricLabel}>curtidas</div>
                    </div>
                    <div>
                      <div className={styles.metricValue}>{m.eng}</div>
                      <div className={styles.metricLabel}>engaj.</div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}
