type AuroraMarkProps = {
  size?: number;
  color?: string;
  className?: string;
};

/** The Aurora star mark — four concave points, from Aurora_Identidade.dc.html. */
export function AuroraMark({ size = 18, color = '#eab4bf', className }: AuroraMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d="M50 2 C53 40 60 47 98 50 C60 53 53 60 50 98 C47 60 40 53 2 50 C40 47 47 40 50 2 Z"
        fill={color}
      />
    </svg>
  );
}
