import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { DarkPanelHeader, BackRow } from '../components/DarkPanelHeader';
import { Avatar } from '../components/Avatar';
import { MediaPlaceholder } from '../components/MediaPlaceholder';
import { ToastView } from '../components/Toast';
import { useCredit } from '../context/CreditContext';
import { REDEMPTIONS } from '../data/credit';
import styles from './CreditoDetailPage.module.css';

export function CreditoDetailPage() {
  const { idx: idxParam } = useParams<{ idx: string }>();
  const navigate = useNavigate();
  const { statusFor, setStatus, toast, flash } = useCredit();

  const idx = Number(idxParam);
  const r = REDEMPTIONS[idx];
  if (!r) return <Navigate to="/credito" replace />;

  const status = statusFor(idx);
  const showActions = status === 'solicitado';
  const showResolved = !showActions;
  const resolvedLabel = status === 'enviado' ? '✓ Peça aprovada e enviada' : '✕ Resgate recusado';
  const resolvedFg = status === 'enviado' ? '#5a8f6a' : '#c05a4e';
  const resolvedBg = status === 'enviado' ? '#e3efe1' : '#f6dcd8';

  function approve() {
    setStatus(idx, 'enviado');
    flash(`${r.product} → ${r.name} · enviado`, '✓');
    navigate('/credito');
  }

  function decline() {
    setStatus(idx, 'recusado');
    flash(`Resgate de ${r.name} recusado`, '✕');
    navigate('/credito');
  }

  return (
    <Screen>
      <DarkPanelHeader>
        <BackRow onBack={() => navigate('/credito')} backLabel="Voltar" title="Resgate" />
        <div className={styles.identityRow}>
          <Avatar initials={r.initials} bg={r.avatarBg} size={40} />
          <div>
            <div className={styles.name}>{r.name}</div>
            <div className={styles.meta}>
              saldo {r.balance} · solicitado {r.date}
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
            <div className={styles.product}>{r.product}</div>
            <div className={styles.variant}>{r.variant}</div>
            <div className={styles.cost}>{r.cost}</div>
            <div className={styles.costLabel}>em crédito</div>
          </div>
        </div>

        <div className={styles.sectionLabel}>Envio</div>
        <div className={styles.shipCard}>
          <div className={styles.shipName}>{r.name}</div>
          <div className={styles.shipAddress}>{r.address}</div>
        </div>

        <div className={styles.afterCard}>
          <div>
            <div className={styles.afterLabel}>Saldo após resgate</div>
            <div className={styles.afterValue}>{r.afterBalance}</div>
          </div>
          <div>
            <div className={styles.prodLabel}>custo de produção</div>
            <div className={styles.prodValue}>{r.prodCost}</div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        {showActions && (
          <div className={styles.actionsRow}>
            <button type="button" className={styles.declineBtn} onClick={decline}>
              ✕
            </button>
            <button type="button" className={styles.approveBtn} onClick={approve}>
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
