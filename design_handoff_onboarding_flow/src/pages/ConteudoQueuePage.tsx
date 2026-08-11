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
import { CONTENT_QUEUE, CONTENT_STATUS_META } from '../data/contentQueue';
import styles from './ConteudoQueuePage.module.css';

type Filter = 'Monitorando' | 'Validados' | 'Falhas' | 'Todos';
const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: 'Monitorando', label: 'Monitorando' },
  { value: 'Validados', label: 'Validados' },
  { value: 'Falhas', label: 'Falhas' },
  { value: 'Todos', label: 'Todos' },
];
const FILTER_MAP: Record<Filter, string[] | null> = {
  Monitorando: ['monitorando'],
  Validados: ['validado'],
  Falhas: ['removido', 'revisar'],
  Todos: null,
};

export function ConteudoQueuePage() {
  const navigate = useNavigate();
  const { statusFor, toast } = useContentQueue();
  const [filter, setFilter] = useState<Filter>('Monitorando');

  const enriched = CONTENT_QUEUE.map((item, idx) => ({ item, idx, status: statusFor(idx) }));
  const monitorCount = enriched.filter((e) => e.status === 'monitorando').length;
  const connectedCount = enriched.filter((e) => e.item.connected).length;

  const allowed = FILTER_MAP[filter];
  const queue = enriched.filter((e) => allowed === null || allowed.includes(e.status));

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
          <span className={styles.bannerText}>Detecção via Instagram ativa · {connectedCount} contas</span>
        </div>
        <div className={styles.chipsRow}>
          <FilterChips ariaLabel="Filtrar conteúdo" options={FILTER_OPTIONS} value={filter} onChange={setFilter} />
        </div>
      </header>

      <div className={`au-scroll ${styles.body}`}>
        <div className={styles.list}>
          {queue.map(({ item, idx, status }) => {
            const meta = CONTENT_STATUS_META[status];
            return (
              <button key={idx} type="button" className={styles.card} onClick={() => navigate(`/conteudo/${idx}`)}>
                <div className={styles.thumb}>
                  <MediaPlaceholder label="mídia" radius={12} badge={item.type} />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardTop}>
                    <Avatar initials={item.initials} bg={item.avatarBg} size={24} />
                    <span className={styles.cardName}>{item.name}</span>
                    <StatusBadge label={meta.label} bg={meta.bg} fg={meta.fg} />
                  </div>
                  <div className={styles.metaRow}>
                    <span>{item.elapsedLabel}</span>
                    <span className={styles.metaCredit}>+ R$ {item.credit}</span>
                  </div>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${item.pct}%`, background: meta.bar }} />
                  </div>
                  <div className={styles.detectLabel}>
                    {item.brand ? `✓ marca · ✓ ${item.coupon}` : '⚠ marca não marcada'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {queue.length === 0 && <div className={styles.empty}>Nada neste filtro.</div>}
      </div>

      <MarcaTabBar />
      <ToastView toast={toast} bottom={96} />
    </Screen>
  );
}
