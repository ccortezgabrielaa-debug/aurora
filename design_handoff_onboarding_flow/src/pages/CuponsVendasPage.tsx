import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { IconButton } from '../components/IconButton';
import { PillSubTabs } from '../components/PillSubTabs';
import { ToastView, useToast } from '../components/Toast';
import { COUPONS, COUPON_STATUS_DOT, SALES_HISTORY } from '../data/coupons';
import styles from './CuponsVendasPage.module.css';

type SubTab = 'cupons' | 'vendas';

export function CuponsVendasPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [subtab, setSubtab] = useState<SubTab>('cupons');
  const { toast, flash } = useToast();

  useEffect(() => {
    const state = location.state as { toastMessage?: string; toastIcon?: string; subtab?: SubTab } | null;
    if (state?.toastMessage) {
      flash(state.toastMessage, state.toastIcon ?? '✓');
      if (state.subtab) setSubtab(state.subtab);
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
            {COUPONS.map((c) => (
              <div key={c.code} className={styles.couponRow}>
                <div className={styles.couponBody}>
                  <div className={styles.codeRow}>
                    <span className={styles.code}>{c.code}</span>
                    <span className={styles.dot} style={{ background: COUPON_STATUS_DOT[c.status] }} />
                  </div>
                  <div className={styles.couponMeta}>
                    {c.name} · {c.shop}
                  </div>
                </div>
                <div className={styles.usesWrap}>
                  <div className={styles.uses}>{c.uses}</div>
                  <div className={styles.usesLabel}>usos</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {subtab === 'vendas' && (
          <div className={styles.list}>
            {SALES_HISTORY.map((s, i) => (
              <div key={i} className={styles.saleRow}>
                <div className={styles.saleBody}>
                  <div className={styles.saleValue}>{s.value}</div>
                  <div className={styles.saleMeta}>
                    {s.date} · {s.code} · {s.name}
                  </div>
                </div>
                <div>
                  <div className={styles.saleCredit}>+ {s.credit}</div>
                  <div className={styles.saleRate}>
                    {s.rate} · {s.tier}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastView toast={toast} bottom={24} />
    </Screen>
  );
}
