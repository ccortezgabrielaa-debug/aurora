import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { IconButton } from '../components/IconButton';
import { PillSubTabs } from '../components/PillSubTabs';
import { ToastView, useToast } from '../components/Toast';
import { formatBRLFull } from '../lib/format';
import { fetchCouponsWithAmbassadors, fetchSalesHistory, type CouponWithAmbassador, type SaleHistoryItem } from '../lib/queries/coupons';
import styles from './CuponsVendasPage.module.css';

type SubTab = 'cupons' | 'vendas';

export function CuponsVendasPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [subtab, setSubtab] = useState<SubTab>('cupons');
  const { toast, flash } = useToast();
  const [coupons, setCoupons] = useState<CouponWithAmbassador[] | null>(null);
  const [sales, setSales] = useState<SaleHistoryItem[] | null>(null);

  useEffect(() => {
    fetchCouponsWithAmbassadors().then(setCoupons);
    fetchSalesHistory().then(setSales);
  }, []);

  useEffect(() => {
    const state = location.state as { toastMessage?: string; toastIcon?: string; subtab?: SubTab } | null;
    if (state?.toastMessage) {
      flash(state.toastMessage, state.toastIcon ?? '✓');
      if (state.subtab) setSubtab(state.subtab);
      fetchCouponsWithAmbassadors().then(setCoupons);
      fetchSalesHistory().then(setSales);
      navigate(location.pathname, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Screen>
      <header className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.titleGroup}>
            <IconButton variant="light" ariaLabel="Voltar" onClick={() => navigate(-1)}>
              ‹
            </IconButton>
            <div>
              <div className={styles.kicker}>Niya · Shopify</div>
              <h1 className={styles.title}>Cupons &amp; Vendas</h1>
            </div>
          </div>
          <IconButton variant="accent" size={42} ariaLabel="Lançar venda" onClick={() => navigate('/cupons-e-vendas/nova')}>
            +
          </IconButton>
        </div>
        <div className={styles.tabRow}>
          <PillSubTabs
            ariaLabel="Seção"
            value={subtab}
            onChange={setSubtab}
            options={[
              { value: 'cupons', label: 'Cupons' },
              { value: 'vendas', label: 'Vendas' },
            ]}
          />
        </div>
      </header>

      <div className={`au-scroll ${styles.body}`}>
        {subtab === 'cupons' && (
          <div className={styles.list}>
            {coupons === null && <div className={styles.loading}>Carregando…</div>}
            {coupons?.map((c) => (
              <div key={c.couponId} className={styles.couponRow}>
                <div className={styles.couponBody}>
                  <div className={styles.codeRow}>
                    <span className={styles.code}>{c.code}</span>
                    <span className={styles.dot} style={{ background: c.ambassadorStatus === 'active' ? '#5aa06a' : '#c3b8ac' }} />
                  </div>
                  <div className={styles.couponMeta}>
                    {c.ambassadorName} · {c.shop ?? 'sem loja vinculada'}
                  </div>
                </div>
                <div className={styles.usesWrap}>
                  <div className={styles.uses}>{c.uses}</div>
                  <div className={styles.usesLabel}>usos</div>
                </div>
              </div>
            ))}
            {coupons?.length === 0 && <div className={styles.loading}>Nenhum cupom ainda.</div>}
          </div>
        )}

        {subtab === 'vendas' && (
          <div className={styles.list}>
            {sales === null && <div className={styles.loading}>Carregando…</div>}
            {sales?.map((s) => (
              <div key={s.id} className={styles.saleRow}>
                <div className={styles.saleBody}>
                  <div className={styles.saleValue}>{formatBRLFull(s.value)}</div>
                  <div className={styles.saleMeta}>
                    {s.date} · {s.code} · {s.ambassadorName}
                  </div>
                </div>
                <div>
                  <div className={styles.saleCredit}>+ {formatBRLFull(s.credit)}</div>
                  <div className={styles.saleRate}>
                    {Math.round((s.credit / s.value) * 100)}% · {s.level}
                  </div>
                </div>
              </div>
            ))}
            {sales?.length === 0 && <div className={styles.loading}>Nenhuma venda ainda.</div>}
          </div>
        )}
      </div>

      <ToastView toast={toast} bottom={24} />
    </Screen>
  );
}
