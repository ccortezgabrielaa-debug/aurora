import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { SegmentedControl } from '../components/SegmentedControl';
import { KpiCard } from '../components/KpiCard';
import { RankingRow } from '../components/RankingRow';
import { MarcaTabBar } from '../components/MarcaTabBar';
import { useAuth } from '../context/AuthContext';
import { fetchMyBrand } from '../lib/queries/brand';
import { fetchDashboardStats, fetchRanking, type DashboardStats, type RankingRow as RankingRowData } from '../lib/queries/dashboard';
import { formatBRL, formatDelta, formatDeltaPct, formatPct } from '../lib/format';
import { PERIOD_LABELS, type Period } from '../data/dashboardData';
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
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>('30d');
  const [brandName, setBrandName] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [ranking, setRanking] = useState<RankingRowData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBrand().then((brand) => setBrandName(brand?.name ?? profile?.full_name ?? null));
    fetchRanking().then(setRanking);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchDashboardStats(period).then((s) => {
      if (active) {
        setStats(s);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [period]);

  const brandLabel = brandName ?? 'seu workspace';
  const brandInitial = (brandName?.trim()[0] ?? 'A').toUpperCase();

  return (
    <Screen>
      <header className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.identity}>
            <div className={styles.avatar}>{brandInitial}</div>
            <div>
              <div className={styles.kicker}>{brandLabel}</div>
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
        {loading || !stats ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--au-taupe)', font: '600 13px var(--au-font-text)' }}>
            Carregando…
          </div>
        ) : (
          <>
            <div className={styles.kpiGrid}>
              <KpiCard
                label="Embaixadoras ativas"
                value={String(stats.ativas)}
                caption={`${formatDelta(stats.ativasDelta)} no período`}
                tone={stats.ativasDelta >= 0 ? 'up' : 'muted'}
              />
              <KpiCard
                label="GMV via cupom"
                value={formatBRL(stats.gmv)}
                caption={formatDeltaPct(stats.gmvDeltaPct)}
                tone={(stats.gmvDeltaPct ?? 0) >= 0 ? 'up' : 'muted'}
                size="sm"
              />
              <KpiCard label="Taxa de resgate" value={formatPct(stats.resgatePct)} caption="do crédito gerado" tone="muted" />
              <KpiCard label="Ativação → venda" value={formatPct(stats.convPct)} caption="conversão" tone="muted" />
            </div>

            <div className={styles.budgetCard}>
              <div className={styles.budgetTop}>
                <div className={styles.budgetLabel}>Crédito por conteúdo</div>
                <div className={styles.budgetPct}>{Math.round(stats.budgetPct)}% do teto</div>
              </div>
              <div className={styles.budgetAmounts}>
                <div className={styles.budgetUsed}>{formatBRL(stats.budgetUsed)}</div>
                <div className={styles.budgetCap}>/ {formatBRL(stats.budgetCap)} orçado</div>
              </div>
              <div className={styles.budgetBar}>
                <div className={styles.budgetBarFill} style={{ width: `${stats.budgetPct}%` }} />
              </div>
            </div>
          </>
        )}

        <div className={styles.sectionHead}>
          <div className={styles.sectionTitle}>Ranking por pontuação</div>
          <button type="button" className={styles.sectionLink} onClick={() => navigate('/embaixadoras')}>
            Ver tudo
          </button>
        </div>
        <div className={styles.rankingList}>
          {ranking.length === 0 && (
            <div style={{ color: 'var(--au-taupe)', font: '600 12.5px var(--au-font-text)', padding: '4px 2px' }}>
              Nenhuma embaixadora ainda.
            </div>
          )}
          {ranking.map((a, i) => (
            <RankingRow key={a.id} rank={i + 1} id={a.id} name={a.name} handle={a.handle} tier={a.level} score={a.score} gmvLabel={formatBRL(a.gmv_30d)} />
          ))}
        </div>

        <div className={styles.sectionHead}>
          <div className={styles.sectionTitle}>Acessos rápidos</div>
        </div>
        <div className={styles.quickLinks}>
          {QUICK_LINKS.map((q) => (
            <button key={q.path} type="button" className={styles.quickLink} onClick={() => navigate(q.path)}>
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
