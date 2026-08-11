import { useEffect, useState } from 'react';
import { Screen } from '../components/Screen';
import { MediaPlaceholder } from '../components/MediaPlaceholder';
import { PortalTabBar } from '../components/PortalTabBar';
import { formatBRLFull } from '../lib/format';
import { fetchPortalCredit, fetchPortalHome, type PortalMe } from '../lib/queries/portal';
import type { MergedLedgerEntry } from '../lib/queries/ledger';
import styles from './PortalCreditoPage.module.css';

// The schema has no product-catalog table — redemptions are free-text entries the
// brand logs, not backed by real inventory. This list is illustrative only, same as
// in the original mockup, now compared against the real credit balance.
const CATALOG = [
  { name: 'Vestido Áurea', cost: 380 },
  { name: 'Conjunto Brisa', cost: 320 },
  { name: 'Blusa Linho Solar', cost: 210 },
  { name: 'Kit Verão', cost: 300 },
];

export function PortalCreditoPage() {
  const [me, setMe] = useState<PortalMe | null>(null);
  const [ledger, setLedger] = useState<MergedLedgerEntry[] | null>(null);

  useEffect(() => {
    fetchPortalHome().then(setMe);
    fetchPortalCredit().then(setLedger);
  }, []);

  const balance = me?.stats.credit_balance ?? 0;

  return (
    <Screen>
      <div className={`au-scroll ${styles.body}`}>
        <h1 className={styles.title}>Crédito</h1>

        <div className={styles.balanceCard}>
          <div className={styles.balanceLabel}>Saldo disponível</div>
          <div className={styles.balanceValue}>{me ? formatBRLFull(balance) : '—'}</div>
          <div className={styles.balanceHint}>fale com a marca para resgatar em peças</div>
        </div>

        <div className={styles.sectionLabel}>Ideias para resgatar</div>
        <div className={styles.catalogRow}>
          {CATALOG.map((p) => {
            const ok = balance >= p.cost;
            return (
              <div key={p.name} className={styles.catalogItem}>
                <div className={styles.catalogPhoto}>
                  <MediaPlaceholder label="peça" radius={14} />
                </div>
                <div className={styles.catalogName}>{p.name}</div>
                <div className={styles.catalogFoot}>
                  <span className={styles.catalogCost}>{formatBRLFull(p.cost)}</span>
                  <span className={styles.catalogStatus} style={{ color: ok ? '#5a8f6a' : '#c05a4e' }}>
                    {ok ? 'no saldo' : 'faltam'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.sectionLabel}>Extrato</div>
        <div className={styles.ledgerList}>
          {ledger === null && <div style={{ color: 'var(--au-taupe)', font: '600 13px var(--au-font-text)', padding: '20px 0', textAlign: 'center' }}>Carregando…</div>}
          {ledger?.map((l) => (
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
          {ledger?.length === 0 && (
            <div style={{ color: 'var(--au-taupe)', font: '600 13px var(--au-font-text)', padding: '20px 0', textAlign: 'center' }}>
              Sem movimentações ainda.
            </div>
          )}
        </div>
      </div>

      <PortalTabBar />
    </Screen>
  );
}
