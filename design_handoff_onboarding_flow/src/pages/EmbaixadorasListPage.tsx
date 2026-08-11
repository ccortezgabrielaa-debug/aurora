import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { ListHeader } from '../components/ListHeader';
import { SearchInput } from '../components/SearchInput';
import { FilterChips } from '../components/FilterChips';
import { IconButton } from '../components/IconButton';
import { Avatar } from '../components/Avatar';
import { StatusBadge } from '../components/StatusBadge';
import { MarcaTabBar } from '../components/MarcaTabBar';
import { AMBASSADORS, TIER_LABEL_STYLE, initials, type Tier } from '../data/ambassadors';
import styles from './EmbaixadorasListPage.module.css';

type TierFilter = 'Todas' | 'Nano' | 'Micro' | 'Macro';
const TIER_OPTIONS: { value: TierFilter; label: string }[] = [
  { value: 'Todas', label: 'Todas' },
  { value: 'Nano', label: 'Nano' },
  { value: 'Micro', label: 'Micro' },
  { value: 'Macro', label: 'Macro' },
];

export function EmbaixadorasListPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [tier, setTier] = useState<TierFilter>('Todas');

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return AMBASSADORS.filter((a) => {
      const tierMatch = tier === 'Todas' || a.tier === (tier.toLowerCase() as Tier);
      const qMatch = q === '' || a.name.toLowerCase().includes(q) || a.handle.toLowerCase().includes(q);
      return tierMatch && qMatch;
    });
  }, [query, tier]);

  return (
    <Screen>
      <ListHeader
        kicker="Aurora Studio"
        title="Embaixadoras"
        right={
          <IconButton variant="accent" ariaLabel="Adicionar embaixadora" size={42}>
            +
          </IconButton>
        }
      >
        <SearchInput value={query} onChange={setQuery} placeholder="Buscar por nome ou @handle" />
        <FilterChips ariaLabel="Filtrar por tier" options={TIER_OPTIONS} value={tier} onChange={setTier} />
      </ListHeader>

      <div className={`au-scroll ${styles.body}`}>
        <div className={styles.countLabel}>
          {list.length} {list.length === 1 ? 'embaixadora' : 'embaixadoras'}
        </div>
        <div className={styles.list}>
          {list.map((a) => {
            const t = TIER_LABEL_STYLE[a.tier];
            return (
              <button
                key={a.handle}
                type="button"
                className={styles.row}
                onClick={() => navigate(`/embaixadoras/${a.handle.replace('@', '')}`)}
              >
                <Avatar
                  initials={initials(a.name)}
                  bg={a.avatarBg}
                  statusColor={a.status === 'ativa' ? '#5aa06a' : '#c3b8ac'}
                />
                <div className={styles.rowBody}>
                  <div className={styles.nameRow}>
                    <span className={styles.name}>{a.name}</span>
                    <StatusBadge label={a.tier} bg={t.bg} fg={t.fg} />
                  </div>
                  <div className={styles.sub}>
                    {a.handle} · {a.coupon}
                  </div>
                </div>
                <div className={styles.scoreWrap}>
                  <div className={styles.score}>
                    {a.score}
                    <span className={styles.scorePts}> PTS</span>
                  </div>
                  <div className={styles.gmv}>{a.gmv}</div>
                </div>
              </button>
            );
          })}
        </div>
        {list.length === 0 && <div className={styles.empty}>Nenhuma embaixadora encontrada.</div>}
      </div>

      <MarcaTabBar />
    </Screen>
  );
}
