import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { BackHeader } from '../components/BackHeader';
import { Avatar } from '../components/Avatar';
import { MediaPlaceholder } from '../components/MediaPlaceholder';
import { ToastView, useToast } from '../components/Toast';
import { MENTIONS, MENTION_TAG } from '../data/socialListening';
import styles from './SocialListeningDetailPage.module.css';

export function SocialListeningDetailPage() {
  const { idx: idxParam } = useParams<{ idx: string }>();
  const navigate = useNavigate();
  const { toast, flash } = useToast();

  const idx = Number(idxParam);
  const m = MENTIONS[idx];
  if (!m) return <Navigate to="/social-listening" replace />;

  const tag = MENTION_TAG[m.kind];
  const isAmbassador = m.kind === 'embaixadora';
  const metrics = [
    { k: 'alcance', v: m.reach },
    { k: 'curtidas', v: m.likes },
    { k: 'engaj.', v: m.eng },
    { k: 'salvos', v: isAmbassador ? '412' : '—' },
  ];

  return (
    <Screen>
      <BackHeader onBack={() => navigate('/social-listening')} title="Menção capturada" />

      <div className={`au-scroll ${styles.body}`}>
        <div className={styles.hero}>
          <MediaPlaceholder label="mídia capturada" radius={18} />
        </div>
        <div className={styles.identityRow}>
          <Avatar initials={m.initials} bg={m.avatarBg} size={38} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className={styles.handle}>{m.handle}</div>
            <div className={styles.meta}>
              {m.platform} · {m.type} · {m.time}
            </div>
          </div>
          <span className={styles.tag} style={{ background: tag.bg, color: tag.fg }}>
            {tag.tag}
          </span>
        </div>
        <p className={styles.caption}>{m.caption}</p>
        <div className={styles.metricsRow}>
          {metrics.map((k) => (
            <div key={k.k} className={styles.metricTile}>
              <div className={styles.metricValue}>{k.v}</div>
              <div className={styles.metricLabel}>{k.k}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.footerBtn}
          style={{ background: 'var(--au-ink)', color: '#fff' }}
          onClick={() => flash('Mídia salva para tráfego pago', '↓', 2000)}
        >
          ↓ Baixar mídia
        </button>
        <button
          type="button"
          className={styles.footerBtn}
          style={{ background: isAmbassador ? '#ece4da' : '#a7d3a5', color: 'var(--au-ink)' }}
          onClick={() =>
            flash(isAmbassador ? `Abrindo perfil de ${m.handle}` : `Convite enviado para ${m.handle}`, '✓')
          }
        >
          {isAmbassador ? 'Ver embaixadora' : 'Convidar creator'}
        </button>
      </div>

      <ToastView toast={toast} bottom={96} />
    </Screen>
  );
}
