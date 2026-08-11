import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { BackHeader } from '../components/BackHeader';
import { ToastView, useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { fetchCreditRules, saveCreditRules, type PerformanceTier } from '../lib/queries/creditRules';
import styles from './RegrasPage.module.css';

const DEFAULT_TIERS: PerformanceTier[] = [
  { name: 'Base', credit_pct: 20, min_sales_per_month: 0 },
  { name: 'Performance', credit_pct: 25, min_sales_per_month: 5 },
  { name: 'Top', credit_pct: 30, min_consistent_months: 3 },
];

function tierCriterionLabel(t: PerformanceTier): string {
  if (t.min_consistent_months !== undefined) return `${t.min_consistent_months}+ meses ativa`;
  if (t.min_sales_per_month !== undefined) return `${t.min_sales_per_month}+ vendas/mês`;
  return 'padrão ao entrar no programa';
}

export function RegrasPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast, flash } = useToast();

  const [rulesId, setRulesId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [tiers, setTiers] = useState<PerformanceTier[]>(DEFAULT_TIERS);
  const [story, setStory] = useState('15');
  const [storyLimit, setStoryLimit] = useState('4');
  const [post, setPost] = useState('40');
  const [postLimit, setPostLimit] = useState('2');
  const [ceil, setCeil] = useState('100');
  const [windowDays, setWindowDays] = useState('60');
  const [validity, setValidity] = useState('60');
  const [minRedeem, setMinRedeem] = useState('80');
  const [wSale, setWSale] = useState('1');
  const [wContent, setWContent] = useState('1');
  const [wStreak, setWStreak] = useState('10');

  useEffect(() => {
    fetchCreditRules().then((rules) => {
      if (rules) {
        setRulesId(rules.id);
        setTiers(Array.isArray(rules.performance_tiers) ? (rules.performance_tiers as unknown as PerformanceTier[]) : DEFAULT_TIERS);
        setStory(String(rules.story_credit_value));
        setStoryLimit(String(rules.story_monthly_limit));
        setPost(String(rules.post_credit_value));
        setPostLimit(String(rules.post_monthly_limit));
        setCeil(String(rules.content_monthly_cap));
        setWindowDays(String(rules.activation_window_days));
        setValidity(String(rules.credit_validity_days));
        setMinRedeem(String(rules.min_redemption_amount));
        setWSale(String(rules.score_weight_sale));
        setWContent(String(rules.score_weight_content));
        setWStreak(String(rules.score_consistency_bonus));
      }
      setLoading(false);
    });
  }, []);

  function updateTierPct(idx: number, pct: string) {
    const n = Number(pct);
    setTiers((ts) => ts.map((t, i) => (i === idx ? { ...t, credit_pct: isNaN(n) ? 0 : n } : t)));
  }

  const num = (v: string) => {
    const n = parseFloat(v.replace(',', '.'));
    return isNaN(n) ? 0 : n;
  };

  const topTier = tiers.reduce((best, t) => (t.credit_pct > best.credit_pct ? t : best), tiers[0] ?? { name: '—', credit_pct: 0 });
  const saleCredit = 'R$ ' + Math.round(890 * (topTier.credit_pct / 100));
  const contentCredit = 'R$ ' + Math.min(num(post) + 2 * num(story), num(ceil));
  const score = Math.round(num(wSale) * 14 + num(wContent) * 8 + num(wStreak) * 5);

  async function handleSave() {
    if (!profile?.brand_id) return;
    setSaving(true);
    const { error } = await saveCreditRules(profile.brand_id, rulesId, {
      performance_tiers: tiers as never,
      story_credit_value: num(story),
      story_monthly_limit: Math.round(num(storyLimit)),
      post_credit_value: num(post),
      post_monthly_limit: Math.round(num(postLimit)),
      content_monthly_cap: num(ceil),
      activation_window_days: Math.round(num(windowDays)),
      credit_validity_days: Math.round(num(validity)),
      min_redemption_amount: num(minRedeem),
      score_weight_sale: num(wSale),
      score_weight_content: num(wContent),
      score_consistency_bonus: num(wStreak),
    });
    setSaving(false);
    if (error) {
      flash('Erro ao salvar: ' + error, '✕');
      return;
    }
    flash('Regras salvas · aplicadas a novos lançamentos');
  }

  if (loading) {
    return (
      <Screen>
        <BackHeader onBack={() => navigate(-1)} title="Regras de crédito" />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--au-taupe)', font: '600 13px var(--au-font-text)' }}>
          Carregando…
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <BackHeader onBack={() => navigate(-1)} title="Regras de crédito" />

      <div className={`au-scroll ${styles.body}`}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionLabel}>Níveis de performance</div>
          <button
            type="button"
            className={styles.addLevelBtn}
            onClick={() => setTiers((ts) => [...ts, { name: 'Novo nível', credit_pct: 22, min_sales_per_month: 0 }])}
          >
            + nível
          </button>
        </div>
        <div className={styles.levelList}>
          {tiers.map((t, i) => (
            <div key={i} className={styles.levelCard}>
              <div className={styles.levelTop}>
                <div className={styles.levelName}>{t.name}</div>
                <div className={styles.levelPctRow}>
                  <input
                    className={`${styles.numBase} ${styles.numInput}`}
                    inputMode="numeric"
                    value={t.credit_pct}
                    onChange={(e) => updateTierPct(i, e.target.value)}
                    aria-label={`Percentual do nível ${t.name}`}
                  />
                  <span className={styles.pctSign}>%</span>
                </div>
              </div>
              <div className={styles.levelCrit}>{tierCriterionLabel(t)}</div>
            </div>
          ))}
        </div>

        <div className={styles.sectionLabel} style={{ marginTop: 18 }}>
          Crédito por conteúdo
        </div>
        <div className={styles.card}>
          <div className={styles.fieldRow}>
            <div>
              <div className={styles.fieldName}>Por story</div>
              <div className={styles.fieldHint}>valor fixo · limite {storyLimit}/mês</div>
            </div>
            <div className={styles.fieldInputRow}>
              <span className={styles.fieldPrefix}>R$</span>
              <input className={`${styles.numBase} ${styles.numInputRight}`} inputMode="numeric" value={story} onChange={(e) => setStory(e.target.value)} aria-label="Crédito por story" />
            </div>
          </div>
          <div className={styles.fieldRow}>
            <div>
              <div className={styles.fieldName}>Limite de stories/mês</div>
            </div>
            <div className={styles.fieldInputRow}>
              <input className={`${styles.numBase} ${styles.numInputRight}`} inputMode="numeric" value={storyLimit} onChange={(e) => setStoryLimit(e.target.value)} aria-label="Limite de stories por mês" />
            </div>
          </div>
          <div className={styles.fieldRow}>
            <div>
              <div className={styles.fieldName}>Por post / reels</div>
              <div className={styles.fieldHint}>valor fixo · limite {postLimit}/mês</div>
            </div>
            <div className={styles.fieldInputRow}>
              <span className={styles.fieldPrefix}>R$</span>
              <input className={`${styles.numBase} ${styles.numInputRight}`} inputMode="numeric" value={post} onChange={(e) => setPost(e.target.value)} aria-label="Crédito por post ou reels" />
            </div>
          </div>
          <div className={styles.fieldRow}>
            <div>
              <div className={styles.fieldName}>Limite de posts/reels por mês</div>
            </div>
            <div className={styles.fieldInputRow}>
              <input className={`${styles.numBase} ${styles.numInputRight}`} inputMode="numeric" value={postLimit} onChange={(e) => setPostLimit(e.target.value)} aria-label="Limite de posts por mês" />
            </div>
          </div>
          <div className={styles.fieldRow}>
            <div>
              <div className={styles.fieldName}>Teto mensal</div>
              <div className={styles.fieldHint}>crédito de conteúdo por embaixadora</div>
            </div>
            <div className={styles.fieldInputRow}>
              <span className={styles.fieldPrefix}>R$</span>
              <input className={`${styles.numBase} ${styles.numInputRight}`} inputMode="numeric" value={ceil} onChange={(e) => setCeil(e.target.value)} aria-label="Teto mensal de crédito de conteúdo" />
            </div>
          </div>
        </div>

        <div className={styles.sectionLabel} style={{ marginTop: 18 }}>
          Prazos e limites
        </div>
        <div className={styles.windowsRow}>
          <div className={styles.windowCard}>
            <input className={`${styles.numBase} ${styles.numInputWindow}`} inputMode="numeric" value={windowDays} onChange={(e) => setWindowDays(e.target.value)} aria-label="Janela de ativação em dias" />
            <div className={styles.windowLabel}>Ativação (dias)</div>
          </div>
          <div className={styles.windowCard}>
            <input className={`${styles.numBase} ${styles.numInputWindow}`} inputMode="numeric" value={validity} onChange={(e) => setValidity(e.target.value)} aria-label="Validade em dias" />
            <div className={styles.windowLabel}>Validade (dias)</div>
          </div>
          <div className={styles.windowCard}>
            <input className={`${styles.numBase} ${styles.numInputWindow}`} inputMode="numeric" value={minRedeem} onChange={(e) => setMinRedeem(e.target.value)} aria-label="Resgate mínimo em reais" />
            <div className={styles.windowLabel}>Mín. resgate R$</div>
          </div>
        </div>

        <div className={styles.sectionLabel} style={{ marginTop: 18 }}>
          Pesos da pontuação
        </div>
        <div className={styles.card}>
          <div>
            <div className={styles.weightRow}>
              <span className={styles.weightLabel}>Peso venda</span>
              <span className={styles.weightValue}>{wSale}×</span>
            </div>
            <input type="range" min={0} max={10} step={1} value={wSale} onChange={(e) => setWSale(e.target.value)} className={styles.slider} aria-label="Peso da venda na pontuação" />
          </div>
          <div>
            <div className={styles.weightRow}>
              <span className={styles.weightLabel}>Peso conteúdo</span>
              <span className={styles.weightValue}>{wContent}×</span>
            </div>
            <input type="range" min={0} max={10} step={1} value={wContent} onChange={(e) => setWContent(e.target.value)} className={styles.slider} aria-label="Peso do conteúdo na pontuação" />
          </div>
          <div>
            <div className={styles.weightRow}>
              <span className={styles.weightLabel}>Bônus consistência</span>
              <span className={styles.weightValue}>{wStreak}×</span>
            </div>
            <input type="range" min={0} max={10} step={1} value={wStreak} onChange={(e) => setWStreak(e.target.value)} className={styles.slider} aria-label="Bônus de consistência na pontuação" />
          </div>
        </div>

        <div className={styles.previewCard}>
          <div className={styles.previewLabel}>Preview · venda de R$ 890 no nível {topTier.name}</div>
          <div className={styles.previewText}>
            Venda de R$ 890 → <strong>{saleCredit}</strong> de crédito
            <br />
            1 post + 2 stories → <strong>{contentCredit}</strong>
            <br />
            Pontuação estimada → <strong style={{ color: '#fff' }}>{score} pts</strong>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <button type="button" className={styles.saveBtn} onClick={handleSave} disabled={saving}>
          {saving ? 'Salvando…' : 'Salvar regras'}
        </button>
      </div>

      <ToastView toast={toast} bottom={96} />
    </Screen>
  );
}
