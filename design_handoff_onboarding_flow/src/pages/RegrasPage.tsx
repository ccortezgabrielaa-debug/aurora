import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { BackHeader } from '../components/BackHeader';
import { ToastView, useToast } from '../components/Toast';
import styles from './RegrasPage.module.css';

type Level = { name: string; pct: string; crit: string };

const INITIAL_LEVELS: Level[] = [
  { name: 'Base', pct: '20', crit: 'padrão ao entrar no programa' },
  { name: 'Performance', pct: '25', crit: '4+ vendas/mês ou 3 meses ativa' },
  { name: 'Top', pct: '30', crit: '12+ vendas/mês ou 6 meses ativa' },
];

function num(v: string): number {
  const n = parseFloat(v.replace(',', '.'));
  return isNaN(n) ? 0 : n;
}

export function RegrasPage() {
  const navigate = useNavigate();
  const { toast, flash } = useToast();

  const [levels, setLevels] = useState<Level[]>(INITIAL_LEVELS);
  const [story, setStory] = useState('40');
  const [post, setPost] = useState('120');
  const [limit, setLimit] = useState('6');
  const [ceil, setCeil] = useState('400');
  const [windowDays, setWindowDays] = useState('60');
  const [validity, setValidity] = useState('90');
  const [minRedeem, setMinRedeem] = useState('150');
  const [wSale, setWSale] = useState('6');
  const [wContent, setWContent] = useState('3');
  const [wStreak, setWStreak] = useState('1');

  function updateLevelPct(idx: number, pct: string) {
    setLevels((ls) => ls.map((l, i) => (i === idx ? { ...l, pct } : l)));
  }

  const topPct = num(levels[2]?.pct ?? '0') / 100;
  const saleCredit = 'R$ ' + Math.round(890 * topPct);
  const contentCredit = 'R$ ' + Math.min(num(post) + 2 * num(story), num(ceil));
  const score = Math.round(num(wSale) * 14 + num(wContent) * 8 + num(wStreak) * 5);

  return (
    <Screen>
      <BackHeader onBack={() => navigate(-1)} title="Regras de crédito" />

      <div className={`au-scroll ${styles.body}`}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionLabel}>Níveis de performance</div>
          <button
            type="button"
            className={styles.addLevelBtn}
            onClick={() => setLevels((ls) => [...ls, { name: 'Novo nível', pct: '22', crit: 'defina o critério' }])}
          >
            + nível
          </button>
        </div>
        <div className={styles.levelList}>
          {levels.map((l, i) => (
            <div key={i} className={styles.levelCard}>
              <div className={styles.levelTop}>
                <div className={styles.levelName}>{l.name}</div>
                <div className={styles.levelPctRow}>
                  <input
                    className={`${styles.numBase} ${styles.numInput}`}
                    inputMode="numeric"
                    value={l.pct}
                    onChange={(e) => updateLevelPct(i, e.target.value)}
                    aria-label={`Percentual do nível ${l.name}`}
                  />
                  <span className={styles.pctSign}>%</span>
                </div>
              </div>
              <div className={styles.levelCrit}>{l.crit}</div>
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
              <div className={styles.fieldHint}>valor fixo</div>
            </div>
            <div className={styles.fieldInputRow}>
              <span className={styles.fieldPrefix}>R$</span>
              <input
                className={`${styles.numBase} ${styles.numInputRight}`}
                inputMode="numeric"
                value={story}
                onChange={(e) => setStory(e.target.value)}
                aria-label="Crédito por story"
              />
            </div>
          </div>
          <div className={styles.fieldRow}>
            <div>
              <div className={styles.fieldName}>Por post / reels</div>
              <div className={styles.fieldHint}>valor fixo</div>
            </div>
            <div className={styles.fieldInputRow}>
              <span className={styles.fieldPrefix}>R$</span>
              <input
                className={`${styles.numBase} ${styles.numInputRight}`}
                inputMode="numeric"
                value={post}
                onChange={(e) => setPost(e.target.value)}
                aria-label="Crédito por post ou reels"
              />
            </div>
          </div>
          <div className={styles.fieldRow}>
            <div>
              <div className={styles.fieldName}>Limite de itens/mês</div>
              <div className={styles.fieldHint}>conteúdos contados</div>
            </div>
            <div className={styles.fieldInputRow}>
              <input
                className={`${styles.numBase} ${styles.numInputRight}`}
                inputMode="numeric"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                aria-label="Limite de itens por mês"
              />
            </div>
          </div>
          <div className={styles.fieldRow}>
            <div>
              <div className={styles.fieldName}>Teto mensal</div>
              <div className={styles.fieldHint}>crédito de conteúdo</div>
            </div>
            <div className={styles.fieldInputRow}>
              <span className={styles.fieldPrefix}>R$</span>
              <input
                className={`${styles.numBase} ${styles.numInputRight}`}
                inputMode="numeric"
                value={ceil}
                onChange={(e) => setCeil(e.target.value)}
                aria-label="Teto mensal de crédito de conteúdo"
              />
            </div>
          </div>
        </div>

        <div className={styles.sectionLabel} style={{ marginTop: 18 }}>
          Prazos e limites
        </div>
        <div className={styles.windowsRow}>
          <div className={styles.windowCard}>
            <input
              className={`${styles.numBase} ${styles.numInputWindow}`}
              inputMode="numeric"
              value={windowDays}
              onChange={(e) => setWindowDays(e.target.value)}
              aria-label="Janela de ativação em dias"
            />
            <div className={styles.windowLabel}>Ativação (dias)</div>
          </div>
          <div className={styles.windowCard}>
            <input
              className={`${styles.numBase} ${styles.numInputWindow}`}
              inputMode="numeric"
              value={validity}
              onChange={(e) => setValidity(e.target.value)}
              aria-label="Validade em dias"
            />
            <div className={styles.windowLabel}>Validade (dias)</div>
          </div>
          <div className={styles.windowCard}>
            <input
              className={`${styles.numBase} ${styles.numInputWindow}`}
              inputMode="numeric"
              value={minRedeem}
              onChange={(e) => setMinRedeem(e.target.value)}
              aria-label="Resgate mínimo em reais"
            />
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
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={wSale}
              onChange={(e) => setWSale(e.target.value)}
              className={styles.slider}
              aria-label="Peso da venda na pontuação"
            />
          </div>
          <div>
            <div className={styles.weightRow}>
              <span className={styles.weightLabel}>Peso conteúdo</span>
              <span className={styles.weightValue}>{wContent}×</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={wContent}
              onChange={(e) => setWContent(e.target.value)}
              className={styles.slider}
              aria-label="Peso do conteúdo na pontuação"
            />
          </div>
          <div>
            <div className={styles.weightRow}>
              <span className={styles.weightLabel}>Bônus consistência</span>
              <span className={styles.weightValue}>{wStreak}×</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={wStreak}
              onChange={(e) => setWStreak(e.target.value)}
              className={styles.slider}
              aria-label="Bônus de consistência na pontuação"
            />
          </div>
        </div>

        <div className={styles.previewCard}>
          <div className={styles.previewLabel}>Preview · Marina (Macro)</div>
          <div className={styles.previewText}>
            Venda de R$ 890 → <strong>{saleCredit}</strong> de crédito
            <br />
            1 Reels + 2 Stories → <strong>{contentCredit}</strong>
            <br />
            Pontuação estimada → <strong style={{ color: '#fff' }}>{score} pts</strong>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.saveBtn}
          onClick={() => flash('Regras salvas · aplicadas a novos lançamentos')}
        >
          Salvar regras
        </button>
      </div>

      <ToastView toast={toast} bottom={96} />
    </Screen>
  );
}
