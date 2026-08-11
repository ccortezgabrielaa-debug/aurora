type ColorSwatchPickerProps = {
  swatches: string[];
  value: string;
  onChange: (hex: string) => void;
  ariaLabel: string;
};

export function ColorSwatchPicker({ swatches, value, onChange, ariaLabel }: ColorSwatchPickerProps) {
  return (
    <div style={{ display: 'flex', gap: 12 }} role="radiogroup" aria-label={ariaLabel}>
      {swatches.map((hex) => {
        const active = hex === value;
        return (
          <button
            key={hex}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={hex}
            onClick={() => onChange(hex)}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: hex,
              border: 0,
              cursor: 'pointer',
              boxShadow: active ? '0 0 0 2px #f4efe8, 0 0 0 4px #26211e' : 'none',
            }}
          />
        );
      })}
    </div>
  );
}
