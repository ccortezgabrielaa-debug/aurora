import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { DarkPanelHeader, BackRow } from '../components/DarkPanelHeader';
import { Avatar } from '../components/Avatar';
import { StatusBadge } from '../components/StatusBadge';
import { PillSubTabs } from '../components/PillSubTabs';
import {
  AMBASSADORS,
  CONTENT_STATUS_STYLE,
  LEDGER_STATUS_STYLE,
  TIER_LABEL_STYLE,
  initials,
  ledgerValueColor,
} from '../data/ambassadors';
import styles from './EmbaixadorasProfilePage.module.css';

type ProfileTab = 'vendas' | 'conteudo' | 'credito';
const TAB_OPTIONS: { value: ProfileTab; label: string }[] = [
  { value: 'vendas', label: 'Vendas' },
  { value: 'conteudo', label: 'Conteúdo' },
  { value: 'credito', label: 'Crédito' },
];

export function EmbaixadorasProfilePage() {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<ProfileTab>('vendas');

  const ambassador = AMBASSADORS.find((a) => a.handle.replace('@', '') === handle);
  if (!ambassador) return <Navigate to="/embaixadoras" replace />;

  const t = TIER_LABEL_STYLE[ambassador.tier];

  return (
    <Screen>
      <DarkPanelHeader>
        <BackRow
          onBack={() => navigate(-1)}
          backLabel="Voltar para embaixadoras"
          right={
            <button type="button" className={styles.editLink}>
              Editar
            </button>
          }
        />
        <div className={styles.identityRow}>
          <Avatar initials={initials(ambassador.name)} bg={ambassador.avatarBg} size={60} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={styles.name}>{ambassador.name}</span>
              <StatusBadge label={ambassador.tier} bg={t.bg} fg={t.fg} size="md" />
            </div>
            <div className={styles.handle}>
              {ambassador.handle} · cupom {ambassador.coupon}
            </div>
          </div>
        </div>
        <div className={styles.statTiles}>
          <div className={styles.statTile}>
            <div className={styles.statValue} data-accent>
              {ambassador.balance}
            </div>
            <div className={styles.statLabel}>Saldo crédito</div>
          </div>
          <div className={styles.statTile}>
            <div className={styles.statValue}>{ambassador.score}</div>
            <div className={styles.statLabel}>Pontuação</div>
          </div>
          <div className={styles.statTile}>
            <div className={styles.statValue} style={{ fontSize: 15 }}>
              {ambassador.gmv}
            </div>
            <div className={styles.statLabel}>GMV gerado</div>
          </div>
        </div>
      </DarkPanelHeader>

      <div className={styles.tabRow}>
        <PillSubTabs ariaLabel="Seção do perfil" options={TAB_OPTIONS} value={tab} onChange={setTab} />
      </div>

      <div className={`au-scroll ${styles.body}`}>
        {tab === 'vendas' && (
          <div className={styles.rowList}>
            {ambassador.sales.map((s, i) => (
              <div key={i} className={styles.saleRow}>
                <div>
                  <div className={styles.saleValue}>{s.value}</div>
                  <div className={styles.saleMeta}>{s.date} · pedido</div>
                </div>
                <div>
                  <div className={styles.saleCredit} style={{ color: 'var(--au-success)' }}>
                    + {s.credit}
                  </div>
                  <div className={styles.saleCreditLabel}>crédito</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'conteudo' && (
          <div className={styles.rowList}>
            {ambassador.content.map((c, i) => {
              const cs = CONTENT_STATUS_STYLE[c.status];
              return (
                <div key={i} className={styles.contentCard}>
                  <div className={styles.contentTop}>
                    <div className={styles.contentTypeRow}>
                      <span className={styles.contentType}>{c.type}</span>
                      <StatusBadge label={c.status} bg={cs.bg} fg={cs.fg} size="md" />
                    </div>
                    <div className={styles.contentCredit}>+ {c.credit}</div>
                  </div>
                  <div className={styles.contentMeta}>
                    {c.date} · {c.days} dias no ar
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'credito' && (
          <div className={styles.rowList}>
            {ambassador.ledger.map((l, i) => {
              const ls = LEDGER_STATUS_STYLE[l.status];
              return (
                <div key={i} className={styles.ledgerRow}>
                  <div>
                    <div className={styles.ledgerSource}>{l.source}</div>
                    <div className={styles.ledgerMeta}>
                      {l.date} · {l.expiry}
                    </div>
                  </div>
                  <div>
                    <div className={styles.ledgerValue} style={{ color: ledgerValueColor(l.value) }}>
                      {l.value}
                    </div>
                    <div className={styles.ledgerStatus} style={{ color: ls.fg }}>
                      {l.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Screen>
  );
}
