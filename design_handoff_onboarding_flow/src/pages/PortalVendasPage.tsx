import { useEffect, useState } from 'react';
import { Screen } from '../components/Screen';
import { PortalTabBar } from '../components/PortalTabBar';
import { formatBRLFull } from '../lib/format';
import { fetchPortalHome, fetchPortalSales, type PortalMe } from '../lib/queries/portal';
import type { Database } from '../lib/database.types';
import styles from './PortalVendasPage.module.css';

type SaleRow = Database['public']['Tables']['sales']['Row'];

export function PortalVendasPage() {
  const [me, setMe] = useState<PortalMe | null>(null);
  const [sales, setSales] = useState<SaleRow[] | null>(null);

  useEffect(() => {
    fetchPortalHome().then(setMe);
    fetchPortalSales().then(setSales);
  }, []);

  return (
    <Screen>
      <div className={`au-scroll ${styles.body}`}>
        <h1 className={styles.title}>Vendas</h1>
        <p className={styles.subtitle}>atribuídas ao cupom {me?.coupon ?? '—'}</p>

        <div className={styles.gmvCard}>
          <div>
            <div className={styles.gmvLabel}>GMV (30 dias)</div>
            <div className={styles.gmvValue}>{me ? formatBRLFull(me.stats.gmv_30d ?? 0) : '—'}</div>
          </div>
          <div>
            <div className={styles.creditValue}>{me ? formatBRLFull(me.creditMonth) : '—'}</div>
            <div className={styles.creditLabel}>crédito gerado</div>
          </div>
        </div>

        <div className={styles.list}>
          {sales === null && <div style={{ color: 'var(--au-taupe)', font: '600 13px var(--au-font-text)', padding: '20px 0', textAlign: 'center' }}>Carregando…</div>}
          {sales?.map((s) => (
            <div key={s.id} className={styles.row}>
              <div>
                <div className={styles.value}>{formatBRLFull(Number(s.order_amount))}</div>
                <div className={styles.meta}>{s.sale_date} · pedido</div>
              </div>
              <div>
                <div className={styles.credit}>+ {formatBRLFull(Number(s.credit_generated))}</div>
                <div className={styles.rate}>{Math.round((Number(s.credit_generated) / Number(s.order_amount)) * 100)}%</div>
              </div>
            </div>
          ))}
          {sales?.length === 0 && (
            <div style={{ color: 'var(--au-taupe)', font: '600 13px var(--au-font-text)', padding: '20px 0', textAlign: 'center' }}>
              Nenhuma venda ainda.
            </div>
          )}
        </div>
      </div>

      <PortalTabBar />
    </Screen>
  );
}
