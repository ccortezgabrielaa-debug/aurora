type StepDotsProps = {
  total: number;
  current: number; // 1-indexed
};

export function StepDots({ total, current }: StepDotsProps) {
  return (
    <div style={{ display: 'flex', gap: 6 }} aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          style={{
            width: 24,
            height: 5,
            borderRadius: 3,
            background: i + 1 === current ? 'var(--au-rose)' : '#e0d5c9',
          }}
        />
      ))}
    </div>
  );
}
