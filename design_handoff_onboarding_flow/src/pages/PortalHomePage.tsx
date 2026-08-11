import { Screen } from '../components/Screen';
import { AuroraMark } from '../components/AuroraMark';
import { Avatar } from '../components/Avatar';
import { PortalTabBar } from '../components/PortalTabBar';
import { ToastView, useToast } from '../components/Toast';
import { ACTIVITY, ME } from '../data/portal';
import styles from './PortalHomePage.module.css';

export function PortalHomePage() {
  const { toast, flash } = useToast();

  async function copy(text: string, message: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard unavailable — the toast still confirms attempted copy
    }
    flash(message, '✓', 1900);
  }

  return (
    <Screen>
      <div className={`au-scroll ${styles.body}`}>
        <div className={styles.topRow}>
          <div>
            <div className={styles.kicker}>Niya · embaixadora</div>
            <h1 className={styles.greeting}>oi, {ME.firstName}</h1>
          </div>
          <Avatar initials={ME.initials} bg={ME.avatarBg} size={44} />
        </div>

        <div className={styles.levelCard}>
          <div className={styles.levelTop}>
            <div>
              <div className={styles.levelLabel}>Seu nível</div>
              <div className={styles.levelValueRow}>
                <AuroraMark size={17} />
                <div className={styles.levelValue}>{ME.level}</div>
              </div>
            </div>
            <div>
              <div className={styles.pointsValue}>{ME.points}</div>
              <div className={styles.pointsLabel}>pontos</div>
            </div>
          </div>
          <div className={styles.levelBar}>
            <div className={styles.levelBarFill} style={{ width: ME.levelPct }} />
          </div>
        </div>

        <div className={styles.couponCard}>
          <div className={styles.couponTop}>
            <div>
              <div className={styles.couponLabel}>Seu cupom</div>
              <div className={styles.couponValue}>{ME.coupon}</div>
            </div>
            <button type="button" className={styles.copyBtn} onClick={() => copy(ME.coupon, 'Cupom copiado')}>
              Copiar
            </button>
          </div>
          <button type="button" className={styles.linkRow} onClick={() => copy(ME.refLink, 'Link copiado para compartilhar')}>
            <span aria-hidden="true" style={{ color: 'var(--au-rose-deep)', fontSize: 13 }}>
              ↗
            </span>
            <span className={styles.linkText}>{ME.refLink}</span>
            <span className={styles.linkAction}>compartilhar</span>
          </button>
        </div>

        <div className={styles.statTiles}>
          <div className={styles.statTile}>
            <div className={styles.statValue}>{ME.balance}</div>
            <div className={styles.statLabel}>Crédito</div>
          </div>
          <div className={styles.statTile}>
            <div className={styles.statValue}>{ME.salesMonth}</div>
            <div className={styles.statLabel}>Vendas/mês</div>
          </div>
          <div className={styles.statTile}>
            <div className={styles.statValue}>{ME.liveContent}</div>
            <div className={styles.statLabel}>No ar</div>
          </div>
        </div>

        <div className={styles.sectionLabel}>Sua atividade</div>
        <div className={styles.activityList}>
          {ACTIVITY.map((a, i) => (
            <div key={i} className={styles.activityRow}>
              <div className={styles.activityIcon} style={{ background: a.iconBg, color: a.iconFg }}>
                {a.icon}
              </div>
              <div className={styles.activityBody}>
                <div className={styles.activityTitle}>{a.title}</div>
                <div className={styles.activityDate}>{a.date}</div>
              </div>
              <div className={styles.activityValue} style={{ color: a.valColor }}>
                {a.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <PortalTabBar />
      <ToastView toast={toast} bottom={96} />
    </Screen>
  );
}
