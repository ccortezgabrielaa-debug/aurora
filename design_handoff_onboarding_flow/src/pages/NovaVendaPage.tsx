import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { BackHeader } from '../components/BackHeader';
import { useAuth } from '../context/AuthContext';
import { formatBRLFull } from '../lib/format';
import { calcSaleCredit, fetchCouponsWithAmbassadors, recordSale, type CouponWithAmbassador } from '../lib/queries/coupons';
import { fetchCreditRules } from '../lib/queries/creditRules';
import type { CreditRules } from '../lib/queries/creditRules';
import styles from './NovaVendaPage.module.css';

const DATE_OPTIONS = ['Hoje', 'Ontem', 'Escolher'];

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export function NovaVendaPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [coupons, setCoupons] = useState<CouponWithAmbassador[] | null>(null);
  const [rules, setRules] = useState<CreditRules | null>(null);
  const [couponIdx, setCouponIdx] = useState(0);
  const [dateIdx, setDateIdx] = useState(0);
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCouponsWithAmbassadors().then(setCoupons);
    fetchCreditRules().then(setRules);
  }, []);

  const coupon = coupons?.[couponIdx];
  const amt = parseFloat(amount.replace(/\./g, '').replace(',', '.')) || 0;
  const has = amt > 0 && !!coupon && !!rules;
  const calc = has ? calcSaleCredit(rules!, coupon!, amt) : null;

  async function handleSave() {
    if (!has || !coupon || !rules || !calc || !profile?.brand_id) return;
    setSaving(true);
    setError(null);
    const saleDate = dateIdx === 1 ? isoDaysAgo(1) : isoDaysAgo(0);
    const { error: saveError } = await recordSale(profile.brand_id, coupon, amt, saleDate, calc);
    setSaving(false);
    if (saveError) {
      setError('Não foi possível salvar a venda: ' + saveError.message);
      return;
    }
    navigate('/cupons-e-vendas', {
      state: {
        toastMessage: `Venda de ${formatBRLFull(amt)} lançada · +${formatBRLFull(calc.credit)} p/ ${coupon.ambassadorName}`,
        toastIcon: '✓',
        subtab: 'vendas',
      },
    });
  }

  return (
    <Screen>
      <BackHeader onBack={() => navigate(-1)} title="Lançar venda" />

      <div className={`au-scroll ${styles.body}`}>
        {coupons === null ? (
          <div style={{ textAlign: 'center', color: 'var(--au-taupe)', font: '600 13px var(--au-font-text)', padding: '40px 0' }}>
            Carregando…
          </div>
        ) : coupons.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--au-taupe)', font: '600 13px var(--au-font-text)', padding: '40px 0' }}>
            Cadastre uma embaixadora com cupom antes de lançar uma venda.
          </div>
        ) : (
          <>
            <div className={styles.sectionLabel}>Cupom usado</div>
            <div className={styles.chipRow}>
              {coupons.map((c, i) => (
                <button
                  key={c.couponId}
                  type="button"
                  className={styles.chip}
                  data-active={i === couponIdx || undefined}
                  onClick={() => setCouponIdx(i)}
                >
                  {c.code}
                </button>
              ))}
            </div>

            <div className={styles.sectionLabel} data-spaced>
              Valor do pedido
            </div>
            <div className={styles.amountBox}>
              <span className={styles.currency}>R$</span>
              <input
                className={styles.amountInput}
                inputMode="numeric"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                aria-label="Valor do pedido"
              />
            </div>

            <div className={styles.sectionLabel} data-spaced>
              Data
            </div>
            <div className={styles.dateRow}>
              {DATE_OPTIONS.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  className={styles.dateChip}
                  data-active={i === dateIdx || undefined}
                  onClick={() => setDateIdx(i)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className={styles.calcCard}>
              <div className={styles.calcTop}>
                <div className={styles.calcLabel}>Crédito calculado</div>
                {calc && (
                  <span className={styles.calcBadge}>
                    {calc.tierName} · {calc.ratePct}%
                  </span>
                )}
              </div>
              <div className={styles.calcValue}>{calc ? formatBRLFull(calc.credit) : 'R$ 0'}</div>
              <div className={styles.calcExplain}>
                {calc && coupon
                  ? `${formatBRLFull(amt)} × ${calc.ratePct}% (${coupon.ambassadorName} · ${calc.tierName})`
                  : 'Informe o valor do pedido para calcular.'}
              </div>
            </div>

            {error && <p style={{ font: '600 12px var(--au-font-text)', color: '#c96a5e', marginTop: 12 }}>{error}</p>}
          </>
        )}
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={!has || saving}
          style={{ color: has ? 'var(--au-ink)' : '#b7ab9e', background: has ? '#a7d3a5' : '#e6decd' }}
        >
          {saving ? 'Salvando…' : 'Salvar venda'}
        </button>
      </div>
    </Screen>
  );
}
