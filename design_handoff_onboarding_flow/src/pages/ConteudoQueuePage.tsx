import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { FilterChips } from '../components/FilterChips';
import { Avatar } from '../components/Avatar';
import { StatusBadge } from '../components/StatusBadge';
import { MediaPlaceholder } from '../components/MediaPlaceholder';
import { MarcaTabBar } from '../components/MarcaTabBar';
import { ToastView } from '../components/Toast';
import { useContentQueue } from '../context/ContentQueueContext';
import { STATUS_META, type DerivedStatus } from '../lib/queries/content';
import { initials } from '../data/ambassadors';
import { avatarColorFor } from '../lib/avatarColor';
import styles from './ConteudoQueuePage.module.css';

type Filter = 'Monitorando' | 'Validados' | 'Falhas' | 'Todos';
const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: 'Monitorando', label: 'Monitorando' },
  { value: 'Validados', label: 'Validados' },
  { value: 'Falhas', label: 'Falhas' },
  { value: 'Todos', label: 'Todos' },
];
const FILTER_MAP: Record<Filter, DerivedStatus[] | null> = {
  Monitorando: ['monitorando'],
  Validados: ['validado'],
  Falhas: ['removido', 'revisar'],
  Todos: null,
};

export function ConteudoQueuePage() {
  const navigate = useNavigate();
  const { items, toast } = useContentQueue();
  const [filter, setFilter] = useState<Filter>('Monitorando');

  const monitorCount = items?.filter((e) => e.status === 'monitorando').length ?? 0;

  const allowed = FILTER_MAP[filter];
  const queue = (items ?? []).filter((e) => allowed === null || allowed.includes(e.status));

  return (
    <Screen>
      <header className={styles.header}>
        <div className={styles.topRow}>
          <div>
            <div className={styles.kicker}>Aurora Studio</div>
            <h1 className={styles.title}>Conteúdo</h1>
          </div>
          <div className={styles.countWrap}>
            <div className={styles.count}>{monitorCount}</div>
            <div className={styles.countLabel}>monitorando</div>
          </div>
        </div>
        <div className={styles.banner}>
          <span aria-hidden="true">⟲</span>
          <span className={styles.bannerText}>Detecção via Instagram ativa</span>
        </div>
        <div className={styles.chipsRow}>
          <FilterChips ariaLabel="Filtrar conteúdo" options={FILTER_OPTIONS} value={filter} onChange={setFilter} />
        </div>
      </header>

      <div className={`au-scroll ${styles.body}`}>
        {items === null && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--au-taupe)', font: '600 13px var(--au-font-text)' }}>
            Carregando…
          </div>
        )}
        <div className={styles.list}>
          {queue.map((item) => {
            const meta = STATUS_META[item.status];
            return (
              <button key={item.row.id} type="button" className={styles.card} onClick={() => navigate(`/conteudo/${item.row.id}`)}>
                <div className={styles.thumb}>
                  <MediaPlaceholder label="mídia" radius={12} badge={item.row.content_type} />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardTop}>
                    <Avatar initials={initials(item.ambassadorName)} bg={avatarColorFor(item.ambassadorId)} size={24} />
                    <span className={styles.cardName}>{item.ambassadorName}</span>
                    <StatusBadge label={meta.label} bg={meta.bg} fg={meta.fg} />
                  </div>
                  <div className={styles.metaRow}>
                    <span>{item.elapsedLabel}</span>
                    <span className={styles.metaCredit}>+ R$ {Math.round(Number(item.row.credit_generated))}</span>
                  </div>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${item.pct}%`, background: meta.bar }} />
                  </div>
                  <div className={styles.detectLabel}>{item.detectLabel}</div>
                </div>
              </button>
            );
          })}
        </div>
        {items !== null && queue.length === 0 && <div className={styles.empty}>Nada neste filtro.</div>}
      </div>

      <MarcaTabBar />
      <ToastView toast={toast} bottom={96} />
    </Screen>
  );
}
