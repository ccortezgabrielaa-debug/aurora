import { useEffect, useState } from 'react';
import { Screen } from '../components/Screen';
import { StatusBadge } from '../components/StatusBadge';
import { PortalTabBar } from '../components/PortalTabBar';
import { deriveStatus, STATUS_META } from '../lib/queries/content';
import { fetchPortalContent } from '../lib/queries/portal';
import type { Database } from '../lib/database.types';
import styles from './PortalConteudoPage.module.css';

type ContentRow = Database['public']['Tables']['content_posts']['Row'];

function daysSince(dateStr: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000));
}

const TARGET_DAYS: Record<ContentRow['content_type'], number> = { story: 1, post: 30, reels: 30 };

export function PortalConteudoPage() {
  const [content, setContent] = useState<ContentRow[] | null>(null);

  useEffect(() => {
    fetchPortalContent().then(setContent);
  }, []);

  return (
    <Screen>
      <div className={`au-scroll ${styles.body}`}>
        <h1 className={styles.title}>Seu conteúdo</h1>
        <p className={styles.subtitle}>marque a marca para contar pontos</p>

        <div className={styles.list}>
          {content === null && <div style={{ color: 'var(--au-taupe)', font: '600 13px var(--au-font-text)', padding: '20px 0', textAlign: 'center' }}>Carregando…</div>}
          {content?.map((c) => {
            const status = deriveStatus(c);
            const meta = STATUS_META[status];
            const days = daysSince(c.publish_date);
            const target = TARGET_DAYS[c.content_type];
            const pct = status === 'validado' ? 100 : Math.min(100, Math.round((days / target) * 100));
            return (
              <div key={c.id} className={styles.card}>
                <div className={styles.top}>
                  <div className={styles.typeRow}>
                    <span className={styles.type}>{c.content_type}</span>
                    <StatusBadge label={meta.label} bg={meta.bg} fg={meta.fg} size="md" />
                  </div>
                  <div className={styles.credit} style={{ color: status === 'removido' ? '#b7ab9e' : status === 'monitorando' ? '#b08a3a' : '#5a8f6a' }}>
                    {status === 'validado' ? `+ R$ ${Math.round(Number(c.credit_generated))}` : status === 'monitorando' ? 'em análise' : 'R$ 0'}
                  </div>
                </div>
                <div className={styles.meta}>
                  {c.publish_date} · {Math.min(days, target)} de {target} {target === 1 ? 'dia' : 'dias'}
                </div>
                {status !== 'removido' && (
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${pct}%`, background: meta.bar }} />
                  </div>
                )}
              </div>
            );
          })}
          {content?.length === 0 && (
            <div style={{ color: 'var(--au-taupe)', font: '600 13px var(--au-font-text)', padding: '20px 0', textAlign: 'center' }}>
              Nenhum conteúdo monitorado ainda.
            </div>
          )}
        </div>
      </div>

      <PortalTabBar />
    </Screen>
  );
}
