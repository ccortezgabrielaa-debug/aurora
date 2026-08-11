import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { DarkPanelHeader } from '../components/DarkPanelHeader';
import { PillSubTabs } from '../components/PillSubTabs';
import { MediaPlaceholder } from '../components/MediaPlaceholder';
import { StatusBadge } from '../components/StatusBadge';
import { MarcaTabBar } from '../components/MarcaTabBar';
import { ToastView } from '../components/Toast';
import { useCredit } from '../context/CreditContext';
import { fetchBrandLedger, fetchCreditSummary, type BrandLedgerEntry, type CreditSummary } from '../lib/queries/credit';
import { formatBRLFull } from '../lib/format';
import styles from './CreditoOverviewPage.module.css';

type SubTab = 'resgates' | 'extrato';

const REDEMPTION_STATUS_META = {
  solicitado: { label: 'Solicitado', bg: '#f6ecd6', fg: '#b08a3a' },
  enviado: { label: 'Enviado', bg: '#e3efe1', fg: '#5a8f6a' },
  recusado: { label: 'Recusado', bg: '#f6dcd8', fg: '#c05a4e' },
};

export function CreditoOverviewPage() {
  const navigate = useNavigate();
  const { redemptions, toast } = useCredit();
  const [subtab, setSubtab] = useState<SubTab>('resgates');
  const [summary, setSummary] = useState<CreditSummary | null>(null);
  const [ledger, setLedger] = useState<BrandLedgerEntry[] | null>(null);

  useEffect(() => {
    fetchCreditSummary().then(setSummary);
    fetchBrandLedger().then(setLedger);
  }, [redemptions]);

  return (
    <Screen>
      <DarkPanelHeader>
        <div className={styles.kicker}>Aurora Studio</div>
        <h1 className={styles.title}>Crédito</h1>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Em circulação</div>
          <div className={styles.summaryValue}>{summary ? formatBRLFull(summary.outstanding) : '—'}</div>
          <div className={styles.miniStats}>
            <div style={{ flex: 1 }}>
              <div className={styles.miniValue}>{summary ? formatBRLFull(summary.issuedMonth) : '—'}</div>
              <div className={styles.miniLabel}>Gerado no mês</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className={styles.miniValue}>{summary ? formatBRLFull(summary.redeemedMonth) : '—'}</div>
              <div className={styles.miniLabel}>Resgatado no mês</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className={styles.miniValue}>{summary?.pendingCount ?? '—'}</div>
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
            {redemptions === null && <div className={styles.loading}>Carregando…</div>}
            {redemptions?.map((r) => {
              const meta = REDEMPTION_STATUS_META[r.status];
              return (
                <button key={r.id} type="button" className={styles.redemptionCard} onClick={() => navigate(`/credito/${r.id}`)}>
                  <div className={styles.thumb}>
                    <MediaPlaceholder label="peça" radius={12} />
                  </div>
                  <div className={styles.redemptionBody}>
                    <div className={styles.product}>{r.item_redeemed}</div>
                    <div className={styles.redemptionMeta}>
                      {r.ambassadorName} · {r.redeemed_at}
                    </div>
                    <div className={styles.redemptionFoot}>
                      <StatusBadge label={meta.label} bg={meta.bg} fg={meta.fg} size="md" />
                      <span className={styles.cost}>{formatBRLFull(Number(r.amount_deducted))}</span>
                    </div>
                  </div>
                  <span className={styles.chevron} aria-hidden="true">
                    ›
                  </span>
                </button>
              );
            })}
            {redemptions?.length === 0 && <div className={styles.loading}>Nenhum resgate ainda.</div>}
          </div>
        )}

        {subtab === 'extrato' && (
          <div className={styles.list}>
            {ledger === null && <div className={styles.loading}>Carregando…</div>}
            {ledger?.map((l) => (
              <div key={l.key} className={styles.ledgerRow}>
                <div className={styles.ledgerIcon} style={{ background: l.amount < 0 ? '#faf1f0' : '#e3efe1', color: l.amount < 0 ? '#c67d88' : '#5a8f6a' }}>
                  {l.amount < 0 ? '↓' : '↑'}
                </div>
                <div className={styles.ledgerBody}>
                  <div className={styles.ledgerTitle}>{l.label}</div>
                  <div className={styles.ledgerMeta}>
                    {l.date.slice(0, 10)} · {l.who}
                  </div>
                </div>
                <div className={styles.ledgerValue} style={{ color: l.amount < 0 ? '#c05a4e' : '#5a8f6a' }}>
                  {l.amount < 0 ? '- ' : '+ '}
                  {formatBRLFull(Math.abs(l.amount))}
                </div>
              </div>
            ))}
            {ledger?.length === 0 && <div className={styles.loading}>Sem movimentações ainda.</div>}
          </div>
        )}
      </div>

      <MarcaTabBar />
      <ToastView toast={toast} bottom={96} />
    </Screen>
  );
}
