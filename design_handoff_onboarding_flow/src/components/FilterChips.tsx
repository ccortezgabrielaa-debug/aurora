import styles from './FilterChips.module.css';

export type ChipOption<T extends string> = {
  value: T;
  label: string;
};

type FilterChipsProps<T extends string> = {
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  fill?: boolean;
};

/** Horizontal single-select chip row — tier/status filters across Embaixadoras, Conteúdo, Social Listening. */
export function FilterChips<T extends string>({ options, value, onChange, ariaLabel, fill }: FilterChipsProps<T>) {
  return (
    <div className={styles.row} data-fill={fill || undefined} role="radiogroup" aria-label={ariaLabel}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={opt.value === value}
          className={styles.chip}
          data-active={opt.value === value || undefined}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
