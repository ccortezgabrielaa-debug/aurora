import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { ListHeader } from '../components/ListHeader';
import { SearchInput } from '../components/SearchInput';
import { FilterChips } from '../components/FilterChips';
import { IconButton } from '../components/IconButton';
import { Avatar } from '../components/Avatar';
import { StatusBadge } from '../components/StatusBadge';
import { MarcaTabBar } from '../components/MarcaTabBar';
import { TIER_LABEL_STYLE, initials, type Tier } from '../data/ambassadors';
import { avatarColorFor } from '../lib/avatarColor';
import { formatBRL } from '../lib/format';
import { fetchAmbassadorsList, type AmbassadorListItem } from '../lib/queries/ambassadors';
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
  const [all, setAll] = useState<AmbassadorListItem[] | null>(null);

  useEffect(() => {
    fetchAmbassadorsList().then(setAll);
  }, []);

  const list = useMemo(() => {
    if (!all) return [];
    const q = query.trim().toLowerCase();
    return all.filter((a) => {
      const tierMatch = tier === 'Todas' || a.level === (tier.toLowerCase() as Tier);
      const qMatch = q === '' || a.name!.toLowerCase().includes(q) || (a.handle ?? '').toLowerCase().includes(q);
      return tierMatch && qMatch;
    });
  }, [all, query, tier]);

  return (
    <Screen>
      <ListHeader
        kicker="Aurora Studio"
        title="Embaixadoras"
        right={
          <IconButton variant="accent" ariaLabel="Adicionar embaixadora" size={42} onClick={() => navigate('/embaixadoras/nova')}>
            +
          </IconButton>
        }
      >
        <SearchInput value={query} onChange={setQuery} placeholder="Buscar por nome ou @handle" />
        <FilterChips ariaLabel="Filtrar por tier" options={TIER_OPTIONS} value={tier} onChange={setTier} />
      </ListHeader>

      <div className={`au-scroll ${styles.body}`}>
        {all === null ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--au-taupe)', font: '600 13px var(--au-font-text)' }}>
            Carregando…
          </div>
        ) : (
          <>
            <div className={styles.countLabel}>
              {list.length} {list.length === 1 ? 'embaixadora' : 'embaixadoras'}
            </div>
            <div className={styles.list}>
              {list.map((a) => {
                const t = TIER_LABEL_STYLE[a.level!];
                return (
                  <button key={a.id} type="button" className={styles.row} onClick={() => navigate(`/embaixadoras/${a.id}`)}>
                    <Avatar initials={initials(a.name!)} bg={avatarColorFor(a.id!)} statusColor={a.status === 'active' ? '#5aa06a' : '#c3b8ac'} />
                    <div className={styles.rowBody}>
                      <div className={styles.nameRow}>
                        <span className={styles.name}>{a.name}</span>
                        <StatusBadge label={a.level!} bg={t.bg} fg={t.fg} />
                      </div>
                      <div className={styles.sub}>
                        {a.handle ?? '—'} {a.coupon ? `· ${a.coupon}` : ''}
                      </div>
                    </div>
                    <div className={styles.scoreWrap}>
                      <div className={styles.score}>
                        {a.score}
                        <span className={styles.scorePts}> PTS</span>
                      </div>
                      <div className={styles.gmv}>{formatBRL(a.gmv_30d ?? 0)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            {list.length === 0 && <div className={styles.empty}>Nenhuma embaixadora encontrada.</div>}
          </>
        )}
      </div>

      <MarcaTabBar />
    </Screen>
  );
}
