import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { DarkPanelHeader, BackRow } from '../components/DarkPanelHeader';
import { Avatar } from '../components/Avatar';
import { MediaPlaceholder } from '../components/MediaPlaceholder';
import { StatusBadge } from '../components/StatusBadge';
import { ToastView } from '../components/Toast';
import { useContentQueue } from '../context/ContentQueueContext';
import { fetchContentItem, rejectContent, validateContent, STATUS_META, type ContentQueueItem } from '../lib/queries/content';
import { initials } from '../data/ambassadors';
import { avatarColorFor } from '../lib/avatarColor';
import styles from './ConteudoReviewPage.module.css';

export function ConteudoReviewPage() {
  const { idx: id } = useParams<{ idx: string }>();
  const navigate = useNavigate();
  const { reload, flash, toast } = useContentQueue();
  const [item, setItem] = useState<ContentQueueItem | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchContentItem(id).then(setItem);
  }, [id]);

  if (item === null) return <Navigate to="/conteudo" replace />;
  if (item === undefined) {
    return (
      <Screen>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--au-taupe)', font: '600 13px var(--au-font-text)' }}>
          Carregando…
        </div>
      </Screen>
    );
  }

  const meta = STATUS_META[item.status];
  const { row } = item;

  const detection = [
    { label: 'Marca mencionada', ok: row.checklist_mentioned_brand },
    { label: item.coupon ? `Cupom ${item.coupon} no texto` : 'Cupom no texto', ok: row.checklist_coupon_visible },
    { label: 'Permanência mínima cumprida', ok: row.checklist_min_days_live },
  ];

  const ringColor =
    item.status === 'removido' ? '#c05a4e' : item.status === 'validado' ? '#5a8f6a' : item.status === 'revisar' ? '#9a8fb0' : '#c67d88';
  const showActions = item.status === 'monitorando' || item.status === 'revisar';
  const showResolved = item.status === 'validado' || item.status === 'removido';

  async function validate() {
    if (item!.status !== 'revisar' || busy) return;
    setBusy(true);
    const { error, credit } = await validateContent(item!);
    setBusy(false);
    if (error) {
      flash('Erro ao validar: ' + error, '✕');
      return;
    }
    flash(`${item!.ambassadorName} validada · +R$ ${credit}`, '✓');
    await reload();
    navigate('/conteudo');
  }

  async function reject() {
    if (busy) return;
    setBusy(true);
    const { error } = await rejectContent(item!.row.id);
    setBusy(false);
    if (error) {
      flash('Erro ao reprovar: ' + error, '✕');
      return;
    }
    flash(`${item!.ambassadorName} — conteúdo reprovado`, '✕');
    await reload();
    navigate('/conteudo');
  }

  return (
    <Screen>
      <DarkPanelHeader>
        <BackRow onBack={() => navigate('/conteudo')} backLabel="Voltar" title="Detalhe do conteúdo" />
        <div className={styles.identityRow}>
          <Avatar initials={initials(item.ambassadorName)} bg={avatarColorFor(item.ambassadorId)} size={40} />
          <div>
            <div className={styles.name}>{item.ambassadorName}</div>
            <div className={styles.meta}>
              {row.content_type} · {row.publish_date} {item.coupon ? `· cupom ${item.coupon}` : ''}
            </div>
          </div>
        </div>
      </DarkPanelHeader>

      <div className={`au-scroll ${styles.body}`}>
        <div className={styles.hero}>
          <MediaPlaceholder label="mídia detectada no Instagram" radius={18} />
        </div>
        {row.link && (
          <p className={styles.caption}>
            <a href={row.link} target="_blank" rel="noreferrer">
              {row.link}
            </a>
          </p>
        )}

        <div className={styles.sectionLabel}>Detecção automática</div>
        <div className={styles.detectionList}>
          {detection.map((d, i) => (
            <div key={i} className={styles.detectionRow}>
              <span className={styles.detectionMark} style={{ background: d.ok ? '#5a8f6a' : '#c05a4e' }}>
                {d.ok ? '✓' : '!'}
              </span>
              <span className={styles.detectionLabel}>{d.label}</span>
              <span style={{ font: '600 10px var(--au-font-text)', color: d.ok ? '#5a8f6a' : '#c05a4e' }}>{d.ok ? 'ok' : 'faltando'}</span>
            </div>
          ))}
        </div>

        <div className={styles.sectionLabel}>Permanência exigida</div>
        <div className={styles.permaCard}>
          <div className={styles.ring} style={{ background: `conic-gradient(${ringColor} ${item.pct}%, #efe7dc 0)` }}>
            <div className={styles.ringInner}>
              <div className={styles.ringPct}>{item.pct}%</div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div className={styles.permaTitle}>{item.reqLabel}</div>
            <div className={styles.permaSub}>{item.elapsedLabel}</div>
            <div style={{ marginTop: 8, display: 'inline-block' }}>
              <StatusBadge label={meta.label} bg={meta.bg} fg={meta.fg} size="md" />
            </div>
          </div>
        </div>

        <div className={styles.creditCard}>
          <div>
            <div className={styles.creditLabel}>Crédito</div>
            <div className={styles.creditValue}>R$ {Math.round(Number(row.credit_generated))}</div>
          </div>
          <div className={styles.creditNote}>
            {item.status === 'validado'
              ? 'Liberado automaticamente ao concluir a permanência.'
              : item.status === 'monitorando'
                ? 'Libera sozinho quando a janela fechar.'
                : item.status === 'removido'
                  ? 'Removido antes do prazo — crédito não liberado.'
                  : 'Marque manualmente após confirmar a marcação.'}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        {showActions && (
          <div className={styles.actionsRow}>
            <button type="button" className={styles.rejectBtn} onClick={reject} disabled={busy}>
              ✕
            </button>
            <button
              type="button"
              className={styles.validateBtn}
              onClick={validate}
              disabled={busy}
              style={{
                color: item.status === 'revisar' ? 'var(--au-ink)' : '#b7ab9e',
                background: item.status === 'revisar' ? '#a7d3a5' : '#e6decd',
              }}
            >
              {item.status === 'revisar' ? 'Validar manualmente' : 'Aguardando permanência'}
            </button>
          </div>
        )}
        {showResolved && (
          <div
            className={styles.resolvedBox}
            style={{
              color: item.status === 'validado' ? '#5a8f6a' : '#c05a4e',
              background: item.status === 'validado' ? '#e3efe1' : '#f6dcd8',
            }}
          >
            {item.status === 'validado' ? `✓ Crédito de R$ ${Math.round(Number(row.credit_generated))} liberado` : '✕ Conteúdo removido antes do prazo'}
          </div>
        )}
      </div>

      <ToastView toast={toast} bottom={96} />
    </Screen>
  );
}
