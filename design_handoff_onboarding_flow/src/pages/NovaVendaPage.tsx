import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { BackHeader } from '../components/BackHeader';
import { COUPONS, brl, parseAmount } from '../data/coupons';
import styles from './NovaVendaPage.module.css';

const DATE_OPTIONS = ['Hoje', 'Ontem', 'Escolher'];

export function NovaVendaPage() {
  const navigate = useNavigate();
  const [couponIdx, setCouponIdx] = useState(0);
  const [dateIdx, setDateIdx] = useState(0);
  const [amount, setAmount] = useState('');

  const coupon = COUPONS[couponIdx];
  const amt = parseAmount(amount);
  const credit = Math.round(amt * coupon.rate);
  const has = amt > 0;

  function handleSave() {
    if (!has) return;
    navigate('/cupons-e-vendas', {
      state: {
        toastMessage: `Venda de ${brl(amt)} lançada · +${brl(credit)} p/ ${coupon.name}`,
        toastIcon: '✓',
        subtab: 'vendas',
      },
    });
  }

  return (
    <Screen>
      <BackHeader onBack={() => navigate(-1)} title="Lançar venda" />

      <div className={`au-scroll ${styles.body}`}>
        <div className={styles.sectionLabel}>Cupom usado</div>
        <div className={styles.chipRow}>
          {COUPONS.map((c, i) => (
            <button
              key={c.code}
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
            <span className={styles.calcBadge}>
              {coupon.tier} · {Math.round(coupon.rate * 100)}%
            </span>
          </div>
          <div className={styles.calcValue}>{has ? brl(credit) : 'R$ 0'}</div>
          <div className={styles.calcExplain}>
            {has
              ? `${brl(amt)} × ${Math.round(coupon.rate * 100)}% (${coupon.name} · ${coupon.tier})`
              : 'Informe o valor do pedido para calcular.'}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.saveBtn}
          onClick={handleSave}
          style={{ color: has ? 'var(--au-ink)' : '#b7ab9e', background: has ? '#a7d3a5' : '#e6decd' }}
        >
          Salvar venda
        </button>
      </div>
    </Screen>
  );
}
