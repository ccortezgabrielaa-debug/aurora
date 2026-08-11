type PillSubTabsProps<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
};

/** Flat pill sub-tabs (each item its own bg) — used by Embaixadoras profile, Cupons & Vendas, Crédito. */
export function PillSubTabs<T extends string>({ options, value, onChange, ariaLabel }: PillSubTabsProps<T>) {
  return (
    <div style={{ display: 'flex', gap: 6 }} role="radiogroup" aria-label={ariaLabel}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1,
              textAlign: 'center',
              font: "600 12px var(--au-font-text)",
              padding: '9px 0',
              borderRadius: 11,
              cursor: 'pointer',
              border: 0,
              color: active ? 'var(--au-ink)' : 'var(--au-taupe-soft)',
              background: active ? 'var(--au-rose)' : 'var(--au-sand)',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
