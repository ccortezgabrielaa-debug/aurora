import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { SegmentedControl } from '../components/SegmentedControl';
import { KpiCard } from '../components/KpiCard';
import { RankingRow } from '../components/RankingRow';
import { MarcaTabBar } from '../components/MarcaTabBar';
import { useOnboarding } from '../context/OnboardingContext';
import { PERIOD_DATA, PERIOD_LABELS, RANKING, type Period } from '../data/dashboardData';
import styles from './DashboardPage.module.css';

const PERIOD_OPTIONS = (Object.keys(PERIOD_LABELS) as Period[]).map((value) => ({
  value,
  label: PERIOD_LABELS[value],
}));

const QUICK_LINKS = [
  { label: 'Cupons & Vendas', icon: '↑', path: '/cupons-e-vendas', bg: '#e3efe1', fg: '#5a8f6a' },
  { label: 'Social Listening', icon: '⟲', path: '/social-listening', bg: '#faf1f0', fg: '#c67d88' },
  { label: 'Regras', icon: '⚙', path: '/regras', bg: '#efe7dc', fg: '#8c7d70' },
];

export function DashboardPage() {
  const { state } = useOnboarding();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>('30d');
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
          <KpiCard label="Embaixadoras ativas" value={k.ativas} caption="sem dados no período" tone="muted" />
          <KpiCard label="GMV via cupom" value={k.gmv} caption="sem dados no período" tone="muted" size="sm" />
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
          <button type="button" className={styles.sectionLink} onClick={() => navigate('/embaixadoras')}>
            Ver tudo
          </button>
        </div>
        {RANKING.length > 0 ? (
          <div className={styles.rankingList}>
            {RANKING.map((a, i) => (
              <RankingRow key={a.handle} rank={i + 1} ambassador={a} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            Ainda não há embaixadoras com pontuação. Os dados aparecem aqui assim que as primeiras vendas forem registradas.
          </div>
        )}

        <div className={styles.sectionHead}>
          <div className={styles.sectionTitle}>Acessos rápidos</div>
        </div>
        <div className={styles.quickLinks}>
          {QUICK_LINKS.map((q) => (
            <button
              key={q.path}
              type="button"
              className={styles.quickLink}
              onClick={() => navigate(q.path)}
            >
              <span className={styles.quickLinkIcon} style={{ background: q.bg, color: q.fg }}>
                {q.icon}
              </span>
              {q.label}
            </button>
          ))}
        </div>
      </div>

      <MarcaTabBar />
    </Screen>
  );
}
