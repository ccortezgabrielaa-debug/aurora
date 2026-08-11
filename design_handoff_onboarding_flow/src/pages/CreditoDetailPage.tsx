import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { DarkPanelHeader, BackRow } from '../components/DarkPanelHeader';
import { Avatar } from '../components/Avatar';
import { MediaPlaceholder } from '../components/MediaPlaceholder';
import { ToastView } from '../components/Toast';
import { useCredit } from '../context/CreditContext';
import { fetchAmbassadorBalance, fetchRedemption, setRedemptionStatus, type RedemptionItem } from '../lib/queries/credit';
import { formatBRLFull } from '../lib/format';
import { initials } from '../data/ambassadors';
import { avatarColorFor } from '../lib/avatarColor';
import styles from './CreditoDetailPage.module.css';

export function CreditoDetailPage() {
  const { idx: id } = useParams<{ idx: string }>();
  const navigate = useNavigate();
  const { reload, flash, toast } = useCredit();
  const [redemption, setRedemption] = useState<RedemptionItem | null | undefined>(undefined);
  const [balance, setBalance] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchRedemption(id).then((r) => {
      setRedemption(r);
      if (r) fetchAmbassadorBalance(r.ambassador_id).then(setBalance);
    });
  }, [id]);

  if (redemption === null) return <Navigate to="/credito" replace />;
  if (redemption === undefined) {
    return (
      <Screen>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--au-taupe)', font: '600 13px var(--au-font-text)' }}>
          Carregando…
        </div>
      </Screen>
    );
  }

  const r = redemption;
  const showActions = r.status === 'solicitado';
  const showResolved = !showActions;
  const resolvedLabel = r.status === 'enviado' ? '✓ Peça aprovada e enviada' : '✕ Resgate recusado';
  const resolvedFg = r.status === 'enviado' ? '#5a8f6a' : '#c05a4e';
  const resolvedBg = r.status === 'enviado' ? '#e3efe1' : '#f6dcd8';
  const afterBalance = balance !== null ? balance - Number(r.amount_deducted) : null;

  async function updateStatus(status: 'enviado' | 'recusado') {
    setBusy(true);
    const { error } = await setRedemptionStatus(r.id, status);
    setBusy(false);
    if (error) {
      flash('Erro: ' + error, '✕');
      return;
    }
    flash(status === 'enviado' ? `${r.item_redeemed} → ${r.ambassadorName} · enviado` : `Resgate de ${r.ambassadorName} recusado`, status === 'enviado' ? '✓' : '✕');
    await reload();
    navigate('/credito');
  }

  return (
    <Screen>
      <DarkPanelHeader>
        <BackRow onBack={() => navigate('/credito')} backLabel="Voltar" title="Resgate" />
        <div className={styles.identityRow}>
          <Avatar initials={initials(r.ambassadorName)} bg={avatarColorFor(r.ambassador_id)} size={40} />
          <div>
            <div className={styles.name}>{r.ambassadorName}</div>
            <div className={styles.meta}>
              saldo {balance !== null ? formatBRLFull(balance) : '—'} · solicitado {r.redeemed_at}
            </div>
          </div>
        </div>
      </DarkPanelHeader>

      <div className={`au-scroll ${styles.body}`}>
        <div className={styles.topRow}>
          <div className={styles.photo}>
            <MediaPlaceholder label="peça" radius={16} />
          </div>
          <div style={{ flex: 1 }}>
            <div className={styles.product}>{r.item_redeemed}</div>
            {r.variant && <div className={styles.variant}>{r.variant}</div>}
            <div className={styles.cost}>{formatBRLFull(Number(r.amount_deducted))}</div>
            <div className={styles.costLabel}>em crédito</div>
          </div>
        </div>

        {r.shipping_address && (
          <>
            <div className={styles.sectionLabel}>Envio</div>
            <div className={styles.shipCard}>
              <div className={styles.shipName}>{r.ambassadorName}</div>
              <div className={styles.shipAddress}>{r.shipping_address}</div>
            </div>
          </>
        )}

        <div className={styles.afterCard}>
          <div>
            <div className={styles.afterLabel}>Saldo após resgate</div>
            <div className={styles.afterValue}>{afterBalance !== null ? formatBRLFull(afterBalance) : '—'}</div>
          </div>
          {r.production_cost !== null && (
            <div>
              <div className={styles.prodLabel}>custo de produção</div>
              <div className={styles.prodValue}>{formatBRLFull(Number(r.production_cost))}</div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        {showActions && (
          <div className={styles.actionsRow}>
            <button type="button" className={styles.declineBtn} onClick={() => updateStatus('recusado')} disabled={busy}>
              ✕
            </button>
            <button type="button" className={styles.approveBtn} onClick={() => updateStatus('enviado')} disabled={busy}>
              Aprovar e enviar peça
            </button>
          </div>
        )}
        {showResolved && (
          <div className={styles.resolvedBox} style={{ color: resolvedFg, background: resolvedBg }}>
            {resolvedLabel}
          </div>
        )}
      </div>

      <ToastView toast={toast} bottom={96} />
    </Screen>
  );
}
