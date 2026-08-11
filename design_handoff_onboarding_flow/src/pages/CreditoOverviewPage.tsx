import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { DarkPanelHeader } from '../components/DarkPanelHeader';
import { PillSubTabs } from '../components/PillSubTabs';
import { MediaPlaceholder } from '../components/MediaPlaceholder';
import { StatusBadge } from '../components/StatusBadge';
import { MarcaTabBar } from '../components/MarcaTabBar';
import { ToastView } from '../components/Toast';
import { useCredit } from '../context/CreditContext';
import { CREDIT_SUMMARY, LEDGER, LEDGER_KIND_STYLE, REDEMPTIONS, REDEMPTION_STATUS_META } from '../data/credit';
import styles from './CreditoOverviewPage.module.css';

type SubTab = 'resgates' | 'extrato';

export function CreditoOverviewPage() {
  const navigate = useNavigate();
  const { statusFor, toast } = useCredit();
  const [subtab, setSubtab] = useState<SubTab>('resgates');

  const pendingCount = REDEMPTIONS.filter((_, i) => statusFor(i) === 'solicitado').length;

  return (
    <Screen>
      <DarkPanelHeader>
        <div className={styles.kicker}>Aurora Studio</div>
        <h1 className={styles.title}>Crédito</h1>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Em circulação</div>
          <div className={styles.summaryValue}>{CREDIT_SUMMARY.outstanding}</div>
          <div className={styles.miniStats}>
            <div style={{ flex: 1 }}>
              <div className={styles.miniValue}>{CREDIT_SUMMARY.issuedMonth}</div>
              <div className={styles.miniLabel}>Gerado no mês</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className={styles.miniValue}>{CREDIT_SUMMARY.redeemedMonth}</div>
              <div className={styles.miniLabel}>Resgatado no mês</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className={styles.miniValue}>{pendingCount}</div>
              <div className={styles.miniLabel}>Resgates p/ enviar</div>
            </div>
          </div>
        </div>
      </DarkPanelHeader>

      <div className={styles.tabRow}>
        <PillSubTabs
          ariaLabel="Seção"
          value={subtab}
          onChange={setSubtab}
          options={[
            { value: 'resgates', label: 'Resgates' },
            { value: 'extrato', label: 'Extrato' },
          ]}
        />
      </div>

      <div className={`au-scroll ${styles.body}`}>
        {subtab === 'resgates' && (
          <div className={styles.list}>
            {REDEMPTIONS.map((r, i) => {
              const status = statusFor(i);
              const meta = REDEMPTION_STATUS_META[status];
              return (
                <button key={i} type="button" className={styles.redemptionCard} onClick={() => navigate(`/credito/${i}`)}>
                  <div className={styles.thumb}>
                    <MediaPlaceholder label="peça" radius={12} />
                  </div>
                  <div className={styles.redemptionBody}>
                    <div className={styles.product}>{r.product}</div>
                    <div className={styles.redemptionMeta}>
                      {r.name} · {r.date}
                    </div>
                    <div className={styles.redemptionFoot}>
                      <StatusBadge label={meta.label} bg={meta.bg} fg={meta.fg} size="md" />
                      <span className={styles.cost}>{r.cost}</span>
                    </div>
                  </div>
                  <span className={styles.chevron} aria-hidden="true">
                    ›
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {subtab === 'extrato' && (
          <div className={styles.list}>
            {LEDGER.map((l, i) => {
              const s = LEDGER_KIND_STYLE[l.kind];
              return (
                <div key={i} className={styles.ledgerRow}>
                  <div className={styles.ledgerIcon} style={{ background: s.iconBg, color: s.iconFg }}>
                    {l.icon}
                  </div>
                  <div className={styles.ledgerBody}>
                    <div className={styles.ledgerTitle}>{l.title}</div>
                    <div className={styles.ledgerMeta}>
                      {l.date} · {l.who}
                    </div>
                  </div>
                  <div className={styles.ledgerValue} style={{ color: s.valColor }}>
                    {l.value}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <MarcaTabBar />
      <ToastView toast={toast} bottom={96} />
    </Screen>
  );
}
