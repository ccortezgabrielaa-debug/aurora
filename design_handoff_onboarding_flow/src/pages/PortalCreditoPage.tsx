import { Screen } from '../components/Screen';
import { MediaPlaceholder } from '../components/MediaPlaceholder';
import { PortalTabBar } from '../components/PortalTabBar';
import { CATALOG, ME, PORTAL_BALANCE_N, PORTAL_LEDGER, PORTAL_LEDGER_STATUS_STYLE } from '../data/portal';
import { ledgerValueColor } from '../data/ambassadors';
import styles from './PortalCreditoPage.module.css';

export function PortalCreditoPage() {
  return (
    <Screen>
      <div className={`au-scroll ${styles.body}`}>
        <h1 className={styles.title}>Crédito</h1>

        <div className={styles.balanceCard}>
          <div className={styles.balanceLabel}>Saldo disponível</div>
          <div className={styles.balanceValue}>{ME.balance}</div>
          <div className={styles.balanceHint}>resgate a partir de R$ 150 · expira em 90 dias</div>
        </div>

        <div className={styles.sectionLabel}>Resgatar em peças</div>
        <div className={styles.catalogRow}>
          {CATALOG.map((p) => {
            const ok = PORTAL_BALANCE_N >= p.costN;
            return (
              <div key={p.name} className={styles.catalogItem}>
                <div className={styles.catalogPhoto}>
                  <MediaPlaceholder label="peça" radius={14} />
                </div>
                <div className={styles.catalogName}>{p.name}</div>
                <div className={styles.catalogFoot}>
                  <span className={styles.catalogCost}>{p.cost}</span>
                  <span className={styles.catalogStatus} style={{ color: ok ? '#5a8f6a' : '#c05a4e' }}>
                    {ok ? 'resgatar' : 'faltam'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.sectionLabel}>Extrato</div>
        <div className={styles.ledgerList}>
          {PORTAL_LEDGER.map((l, i) => {
            const s = PORTAL_LEDGER_STATUS_STYLE[l.status];
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
                  <div className={styles.ledgerStatus} style={{ color: s.fg }}>
                    {l.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <PortalTabBar />
    </Screen>
  );
}
