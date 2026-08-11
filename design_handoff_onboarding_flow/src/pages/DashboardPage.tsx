import { useState } from 'react';
import { Screen } from '../components/Screen';
import { SegmentedControl } from '../components/SegmentedControl';
import { KpiCard } from '../components/KpiCard';
import { RankingRow } from '../components/RankingRow';
import { BottomTabBar } from '../components/BottomTabBar';
import { useOnboarding } from '../context/OnboardingContext';
import { DASHBOARD_TABS, PERIOD_DATA, PERIOD_LABELS, RANKING, type Period } from '../data/dashboardData';
import styles from './DashboardPage.module.css';

const PERIOD_OPTIONS = (Object.keys(PERIOD_LABELS) as Period[]).map((value) => ({
  value,
  label: PERIOD_LABELS[value],
}));

export function DashboardPage() {
  const { state } = useOnboarding();
  const [period, setPeriod] = useState<Period>('30d');
  const [activeTab, setActiveTab] = useState('Início');
  const k = PERIOD_DATA[period];
  const brandInitial = (state.brand.trim()[0] || 'A').toUpperCase();

  return (
    <Screen>
      <header className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.identity}>
            <div className={styles.avatar}>
              {state.logoUrl ? (
                <img src={state.logoUrl} alt="" className={styles.avatarImg} />
              ) : (
                brandInitial
              )}
            </div>
            <div>
              <div className={styles.kicker}>{state.brand || 'Aurora Studio'}</div>
              <div className={styles.pageTitle}>Visão geral</div>
            </div>
          </div>
          <button type="button" className={styles.bell} aria-label="Notificações">
            ◔<span className={styles.bellDot} />
          </button>
        </div>

        <div className={styles.periodToggle}>
          <SegmentedControl ariaLabel="Período" options={PERIOD_OPTIONS} value={period} onChange={setPeriod} />
        </div>
      </header>

      <div className={`au-scroll ${styles.body}`}>
        <div className={styles.kpiGrid}>
          <KpiCard label="Embaixadoras ativas" value={k.ativas} caption={`↑ ${k.ativasDelta} no período`} tone="up" />
          <KpiCard label="GMV via cupom" value={k.gmv} caption={`↑ ${k.gmvDelta}`} tone="up" size="sm" />
          <KpiCard label="Taxa de resgate" value={k.resgate} caption="do crédito gerado" tone="muted" />
          <KpiCard label="Ativação → venda" value={k.conv} caption="conversão" tone="muted" />
        </div>

        <div className={styles.budgetCard}>
          <div className={styles.budgetTop}>
            <div className={styles.budgetLabel}>Crédito por conteúdo</div>
            <div className={styles.budgetPct}>{k.budgetPct} do teto</div>
          </div>
          <div className={styles.budgetAmounts}>
            <div className={styles.budgetUsed}>{k.budgetUsed}</div>
            <div className={styles.budgetCap}>/ {k.budgetCap} orçado</div>
          </div>
          <div className={styles.budgetBar}>
            <div className={styles.budgetBarFill} style={{ width: k.budgetPct }} />
          </div>
        </div>

        <div className={styles.sectionHead}>
          <div className={styles.sectionTitle}>Ranking por pontuação</div>
          <button type="button" className={styles.sectionLink}>
            Ver tudo
          </button>
        </div>
        <div className={styles.rankingList}>
          {RANKING.map((a, i) => (
            <RankingRow key={a.handle} rank={i + 1} ambassador={a} />
          ))}
        </div>
      </div>

      <BottomTabBar tabs={DASHBOARD_TABS} active={activeTab} onChange={setActiveTab} />
    </Screen>
  );
}
