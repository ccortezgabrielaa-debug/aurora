import { Screen } from '../components/Screen';
import { StatusBadge } from '../components/StatusBadge';
import { PortalTabBar } from '../components/PortalTabBar';
import { PORTAL_CONTENT, PORTAL_CONTENT_STATUS_STYLE, portalContentCreditColor } from '../data/portal';
import styles from './PortalConteudoPage.module.css';

export function PortalConteudoPage() {
  return (
    <Screen>
      <div className={`au-scroll ${styles.body}`}>
        <h1 className={styles.title}>Seu conteúdo</h1>
        <p className={styles.subtitle}>marque @niya.oficial para contar pontos</p>

        <div className={styles.list}>
          {PORTAL_CONTENT.map((c, i) => {
            const s = PORTAL_CONTENT_STATUS_STYLE[c.status];
            return (
              <div key={i} className={styles.card}>
                <div className={styles.top}>
                  <div className={styles.typeRow}>
                    <span className={styles.type}>{c.type}</span>
                    <StatusBadge label={c.status} bg={s.bg} fg={s.fg} size="md" />
                  </div>
                  <div className={styles.credit} style={{ color: portalContentCreditColor(c.status) }}>
                    {c.credit}
                  </div>
                </div>
                <div className={styles.meta}>
                  {c.date} · {c.perma}
                </div>
                {c.showBar && (
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${c.pct}%`, background: c.barColor }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <PortalTabBar />
    </Screen>
  );
}
