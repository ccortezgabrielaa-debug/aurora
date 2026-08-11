import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { DarkPanelHeader, BackRow } from '../components/DarkPanelHeader';
import { Avatar } from '../components/Avatar';
import { StatusBadge } from '../components/StatusBadge';
import { PillSubTabs } from '../components/PillSubTabs';
import { TIER_LABEL_STYLE, initials } from '../data/ambassadors';
import { avatarColorFor } from '../lib/avatarColor';
import { formatBRL, formatBRLFull } from '../lib/format';
import { fetchAmbassadorDetail, type AmbassadorDetail } from '../lib/queries/ambassadors';
import { mergeLedger } from '../lib/queries/ledger';
import styles from './EmbaixadorasProfilePage.module.css';

type ProfileTab = 'vendas' | 'conteudo' | 'credito';
const TAB_OPTIONS: { value: ProfileTab; label: string }[] = [
  { value: 'vendas', label: 'Vendas' },
  { value: 'conteudo', label: 'Conteúdo' },
  { value: 'credito', label: 'Crédito' },
];

const APPROVAL_STYLE = {
  pending: { label: 'Pendente', bg: '#f6ecd6', fg: '#b08a3a' },
  approved: { label: 'Aprovado', bg: '#e3efe1', fg: '#5a8f6a' },
  rejected: { label: 'Rejeitado', bg: '#f6dcd8', fg: '#c05a4e' },
};

function daysAgo(dateStr: string): number {
  const ms = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, Math.floor(ms / 86400000));
}

export function EmbaixadorasProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<ProfileTab>('vendas');
  const [detail, setDetail] = useState<AmbassadorDetail | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    fetchAmbassadorDetail(id).then(setDetail);
  }, [id]);

  if (detail === null) return <Navigate to="/embaixadoras" replace />;
  if (detail === undefined) {
    return (
      <Screen>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--au-taupe)', font: '600 13px var(--au-font-text)' }}>
          Carregando…
        </div>
      </Screen>
    );
  }

  const { stats, coupon, sales, content, ledger, redemptions } = detail;
  const t = TIER_LABEL_STYLE[stats.level!];
  const creditEntries = mergeLedger(ledger, redemptions);

  return (
    <Screen>
      <DarkPanelHeader>
        <BackRow onBack={() => navigate(-1)} backLabel="Voltar para embaixadoras" />
        <div className={styles.identityRow}>
          <Avatar initials={initials(stats.name!)} bg={avatarColorFor(stats.id!)} size={60} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={styles.name}>{stats.name}</span>
              <StatusBadge label={stats.level!} bg={t.bg} fg={t.fg} size="md" />
            </div>
            <div className={styles.handle}>
              {stats.handle ?? '—'} {coupon ? `· cupom ${coupon}` : ''}
            </div>
          </div>
        </div>
        <div className={styles.statTiles}>
          <div className={styles.statTile}>
            <div className={styles.statValue} data-accent>
              {formatBRLFull(stats.credit_balance ?? 0)}
            </div>
            <div className={styles.statLabel}>Saldo crédito</div>
          </div>
          <div className={styles.statTile}>
            <div className={styles.statValue}>{stats.score}</div>
            <div className={styles.statLabel}>Pontuação</div>
          </div>
          <div className={styles.statTile}>
            <div className={styles.statValue} style={{ fontSize: 15 }}>
              {formatBRL(stats.gmv_30d ?? 0)}
            </div>
            <div className={styles.statLabel}>GMV (30d)</div>
          </div>
        </div>
      </DarkPanelHeader>

      <div className={styles.tabRow}>
        <PillSubTabs ariaLabel="Seção do perfil" options={TAB_OPTIONS} value={tab} onChange={setTab} />
      </div>

      <div className={`au-scroll ${styles.body}`}>
        {tab === 'vendas' && (
          <div className={styles.rowList}>
            {sales.length === 0 && <div className={styles.empty}>Nenhuma venda registrada.</div>}
            {sales.map((s) => (
              <div key={s.id} className={styles.saleRow}>
                <div>
                  <div className={styles.saleValue}>{formatBRLFull(Number(s.order_amount))}</div>
                  <div className={styles.saleMeta}>{s.sale_date} · pedido</div>
                </div>
                <div>
                  <div className={styles.saleCredit} style={{ color: 'var(--au-success)' }}>
                    + {formatBRLFull(Number(s.credit_generated))}
                  </div>
                  <div className={styles.saleCreditLabel}>crédito</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'conteudo' && (
          <div className={styles.rowList}>
            {content.length === 0 && <div className={styles.empty}>Nenhum conteúdo monitorado.</div>}
            {content.map((c) => {
              const cs = APPROVAL_STYLE[c.approval_status];
              return (
                <div key={c.id} className={styles.contentCard}>
                  <div className={styles.contentTop}>
                    <div className={styles.contentTypeRow}>
                      <span className={styles.contentType}>{c.content_type}</span>
                      <StatusBadge label={cs.label} bg={cs.bg} fg={cs.fg} size="md" />
                    </div>
                    <div className={styles.contentCredit}>+ {formatBRLFull(Number(c.credit_generated))}</div>
                  </div>
                  <div className={styles.contentMeta}>
                    {c.publish_date} · {daysAgo(c.publish_date)} dias no ar
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'credito' && (
          <div className={styles.rowList}>
            {creditEntries.length === 0 && <div className={styles.empty}>Sem movimentações de crédito.</div>}
            {creditEntries.map((l) => (
              <div key={l.key} className={styles.ledgerRow}>
                <div>
                  <div className={styles.ledgerSource}>{l.label}</div>
                  <div className={styles.ledgerMeta}>{l.date.slice(0, 10)}</div>
                </div>
                <div>
                  <div className={styles.ledgerValue} style={{ color: l.amount < 0 ? '#c05a4e' : '#5a8f6a' }}>
                    {l.amount < 0 ? '- ' : '+ '}
                    {formatBRLFull(Math.abs(l.amount))}
                  </div>
                  <div className={styles.ledgerStatus} style={{ color: l.statusColor }}>
                    {l.statusLabel}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Screen>
  );
}
