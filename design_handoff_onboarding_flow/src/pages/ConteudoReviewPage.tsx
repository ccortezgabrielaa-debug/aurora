import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { DarkPanelHeader, BackRow } from '../components/DarkPanelHeader';
import { Avatar } from '../components/Avatar';
import { MediaPlaceholder } from '../components/MediaPlaceholder';
import { StatusBadge } from '../components/StatusBadge';
import { ToastView } from '../components/Toast';
import { useContentQueue } from '../context/ContentQueueContext';
import { CONTENT_QUEUE, CONTENT_STATUS_META } from '../data/contentQueue';
import styles from './ConteudoReviewPage.module.css';

export function ConteudoReviewPage() {
  const { idx: idxParam } = useParams<{ idx: string }>();
  const navigate = useNavigate();
  const { statusFor, setStatus, toast, flash } = useContentQueue();

  const idx = Number(idxParam);
  const item = CONTENT_QUEUE[idx];
  if (!item) return <Navigate to="/conteudo" replace />;

  const status = statusFor(idx);
  const meta = CONTENT_STATUS_META[status];

  const detection = [
    { label: 'Marca @aurora.studio marcada', ok: item.brand },
    { label: `Cupom ${item.coupon} no texto`, ok: item.couponOk },
    { label: 'Conta do Instagram conectada', ok: item.connected },
  ];

  const ringColor =
    status === 'removido' ? '#c05a4e' : status === 'validado' ? '#5a8f6a' : status === 'revisar' ? '#9a8fb0' : '#c67d88';
  const permaTitle = item.cat === 'story' ? 'Story · 24h no ar' : 'Post no feed · 30 dias';
  const creditNote =
    status === 'validado'
      ? 'Liberado automaticamente ao concluir a permanência.'
      : status === 'monitorando'
        ? 'Libera sozinho quando a janela fechar.'
        : status === 'removido'
          ? 'Removido antes do prazo — crédito não liberado.'
          : 'Marque manualmente após confirmar a marcação.';

  const showActions = status === 'monitorando' || status === 'revisar';
  const showResolved = status === 'validado' || status === 'removido';

  function validate() {
    if (status !== 'revisar') return;
    setStatus(idx, 'validado');
    flash(`${item.name} validada · +R$ ${item.credit}`, '✓');
    navigate('/conteudo');
  }

  function reject() {
    setStatus(idx, 'removido');
    flash(`${item.name} — conteúdo reprovado`, '✕');
    navigate('/conteudo');
  }

  return (
    <Screen>
      <DarkPanelHeader>
        <BackRow onBack={() => navigate('/conteudo')} backLabel="Voltar" title="Detalhe do conteúdo" />
        <div className={styles.identityRow}>
          <Avatar initials={item.initials} bg={item.avatarBg} size={40} />
          <div>
            <div className={styles.name}>{item.name}</div>
            <div className={styles.meta}>
              {item.type} · {item.date} · cupom {item.coupon}
            </div>
          </div>
        </div>
      </DarkPanelHeader>

      <div className={`au-scroll ${styles.body}`}>
        <div className={styles.hero}>
          <MediaPlaceholder label="mídia detectada no Instagram" radius={18} />
        </div>
        <p className={styles.caption}>{item.caption}</p>

        <div className={styles.sectionLabel}>Detecção automática</div>
        <div className={styles.detectionList}>
          {detection.map((d, i) => (
            <div key={i} className={styles.detectionRow}>
              <span
                className={styles.detectionMark}
                style={{ background: d.ok ? '#5a8f6a' : '#c05a4e' }}
              >
                {d.ok ? '✓' : '!'}
              </span>
              <span className={styles.detectionLabel}>{d.label}</span>
              <span style={{ font: '600 10px var(--au-font-text)', color: d.ok ? '#5a8f6a' : '#c05a4e' }}>
                {d.ok ? 'ok' : 'faltando'}
              </span>
            </div>
          ))}
        </div>

        <div className={styles.sectionLabel}>Permanência exigida</div>
        <div className={styles.permaCard}>
          <div className={styles.ring} style={{ background: `conic-gradient(${ringColor} ${item.pct}%, #efe7dc 0)` }}>
            <div className={styles.ringInner}>
              <div className={styles.ringPct}>{Math.round(item.pct)}%</div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div className={styles.permaTitle}>{permaTitle}</div>
            <div className={styles.permaSub}>{item.elapsedLabel}</div>
            <div style={{ marginTop: 8, display: 'inline-block' }}>
              <StatusBadge label={meta.label} bg={meta.bg} fg={meta.fg} size="md" />
            </div>
          </div>
        </div>

        <div className={styles.creditCard}>
          <div>
            <div className={styles.creditLabel}>Crédito</div>
            <div className={styles.creditValue}>R$ {item.credit}</div>
          </div>
          <div className={styles.creditNote}>{creditNote}</div>
        </div>
      </div>

      <div className={styles.footer}>
        {showActions && (
          <div className={styles.actionsRow}>
            <button type="button" className={styles.rejectBtn} onClick={reject}>
              ✕
            </button>
            <button
              type="button"
              className={styles.validateBtn}
              onClick={validate}
              style={{
                color: status === 'revisar' ? 'var(--au-ink)' : '#b7ab9e',
                background: status === 'revisar' ? '#a7d3a5' : '#e6decd',
              }}
            >
              {status === 'revisar' ? 'Validar manualmente' : 'Aguardando permanência'}
            </button>
          </div>
        )}
        {showResolved && (
          <div
            className={styles.resolvedBox}
            style={{
              color: status === 'validado' ? '#5a8f6a' : '#c05a4e',
              background: status === 'validado' ? '#e3efe1' : '#f6dcd8',
            }}
          >
            {status === 'validado' ? `✓ Crédito de R$ ${item.credit} liberado` : '✕ Conteúdo removido antes do prazo'}
          </div>
        )}
      </div>

      <ToastView toast={toast} bottom={96} />
    </Screen>
  );
}
