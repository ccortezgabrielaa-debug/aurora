import { useEffect, useState } from 'react';
import { Screen } from '../components/Screen';
import { AuroraMark } from '../components/AuroraMark';
import { Avatar } from '../components/Avatar';
import { PortalTabBar } from '../components/PortalTabBar';
import { ToastView, useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { initials } from '../data/ambassadors';
import { avatarColorFor } from '../lib/avatarColor';
import { formatBRLFull } from '../lib/format';
import { fetchPortalActivity, fetchPortalHome, type PortalActivityEntry, type PortalMe } from '../lib/queries/portal';
import styles from './PortalHomePage.module.css';

export function PortalHomePage() {
  const { profile } = useAuth();
  const { toast, flash } = useToast();
  const [me, setMe] = useState<PortalMe | null>(null);
  const [activity, setActivity] = useState<PortalActivityEntry[]>([]);

  useEffect(() => {
    fetchPortalHome().then(setMe);
    fetchPortalActivity().then(setActivity);
  }, []);

  async function copy(text: string, message: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard unavailable — the toast still confirms attempted copy
    }
    flash(message, '✓', 1900);
  }

  if (!me) {
    return (
      <Screen>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--au-taupe)', font: '600 13px var(--au-font-text)' }}>
          Carregando…
        </div>
      </Screen>
    );
  }

  const firstName = (profile?.full_name ?? me.stats.name ?? '').trim().split(' ')[0] || 'tudo';
  const refLink = `${me.brandName.toLowerCase().replace(/\s+/g, '')}.com.br/${me.stats.handle ?? ''}`;

  return (
    <Screen>
      <div className={`au-scroll ${styles.body}`}>
        <div className={styles.topRow}>
          <div>
            <div className={styles.kicker}>{me.brandName} · embaixadora</div>
            <h1 className={styles.greeting}>oi, {firstName}</h1>
          </div>
          <Avatar initials={initials(me.stats.name ?? '?')} bg={avatarColorFor(me.stats.id ?? firstName)} size={44} />
        </div>

        <div className={styles.levelCard}>
          <div className={styles.levelTop}>
            <div>
              <div className={styles.levelLabel}>Seu nível</div>
              <div className={styles.levelValueRow}>
                <AuroraMark size={17} />
                <div className={styles.levelValue}>{me.levelName}</div>
              </div>
            </div>
            <div>
              <div className={styles.pointsValue}>{me.stats.score ?? 0}</div>
              <div className={styles.pointsLabel}>pontos</div>
            </div>
          </div>
          <div className={styles.levelBar}>
            <div className={styles.levelBarFill} style={{ width: `${me.levelPct}%` }} />
          </div>
        </div>

        <div className={styles.couponCard}>
          <div className={styles.couponTop}>
            <div>
              <div className={styles.couponLabel}>Seu cupom</div>
              <div className={styles.couponValue}>{me.coupon ?? '—'}</div>
            </div>
            {me.coupon && (
              <button type="button" className={styles.copyBtn} onClick={() => copy(me.coupon!, 'Cupom copiado')}>
                Copiar
              </button>
            )}
          </div>
          <button type="button" className={styles.linkRow} onClick={() => copy(refLink, 'Link copiado para compartilhar')}>
            <span aria-hidden="true" style={{ color: 'var(--au-rose-deep)', fontSize: 13 }}>
              ↗
            </span>
            <span className={styles.linkText}>{refLink}</span>
            <span className={styles.linkAction}>compartilhar</span>
          </button>
        </div>

        <div className={styles.statTiles}>
          <div className={styles.statTile}>
            <div className={styles.statValue}>{formatBRLFull(me.stats.credit_balance ?? 0)}</div>
            <div className={styles.statLabel}>Crédito</div>
          </div>
          <div className={styles.statTile}>
            <div className={styles.statValue}>{me.stats.sales_count_30d ?? 0}</div>
            <div className={styles.statLabel}>Vendas/mês</div>
          </div>
          <div className={styles.statTile}>
            <div className={styles.statValue}>{me.liveContent}</div>
            <div className={styles.statLabel}>No ar</div>
          </div>
        </div>

        <div className={styles.sectionLabel}>Sua atividade</div>
        <div className={styles.activityList}>
          {activity.length === 0 && (
            <div style={{ color: 'var(--au-taupe)', font: '600 12.5px var(--au-font-text)' }}>Sem atividade ainda.</div>
          )}
          {activity.map((a) => (
            <div key={a.key} className={styles.activityRow}>
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
