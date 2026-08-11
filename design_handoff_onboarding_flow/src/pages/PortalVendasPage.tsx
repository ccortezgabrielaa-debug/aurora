import { Screen } from '../components/Screen';
import { PortalTabBar } from '../components/PortalTabBar';
import { ME, PORTAL_SALES } from '../data/portal';
import styles from './PortalVendasPage.module.css';

export function PortalVendasPage() {
  return (
    <Screen>
      <div className={`au-scroll ${styles.body}`}>
        <h1 className={styles.title}>Vendas</h1>
        <p className={styles.subtitle}>atribuídas ao cupom {ME.coupon}</p>

        <div className={styles.gmvCard}>
          <div>
            <div className={styles.gmvLabel}>GMV no mês</div>
            <div className={styles.gmvValue}>{ME.gmvMonth}</div>
          </div>
          <div>
            <div className={styles.creditValue}>{ME.creditMonth}</div>
            <div className={styles.creditLabel}>crédito gerado</div>
          </div>
        </div>

        <div className={styles.list}>
          {PORTAL_SALES.map((s, i) => (
            <div key={i} className={styles.row}>
              <div>
                <div className={styles.value}>{s.value}</div>
                <div className={styles.meta}>
                  {s.date} · pedido {s.order}
                </div>
              </div>
              <div>
                <div className={styles.credit}>+ {s.credit}</div>
                <div className={styles.rate}>{s.rate}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PortalTabBar />
    </Screen>
  );
}
