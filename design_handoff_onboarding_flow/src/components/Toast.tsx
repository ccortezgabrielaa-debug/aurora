import { useCallback, useRef, useState } from 'react';

export function useToast() {
  const [toast, setToast] = useState<{ message: string; icon: string } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const flash = useCallback((message: string, icon = '✓', durationMs = 2200) => {
    setToast({ message, icon });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), durationMs);
  }, []);

  return { toast, flash };
}

type ToastViewProps = {
  toast: { message: string; icon: string } | null;
  bottom?: number;
};

export function ToastView({ toast, bottom = 24 }: ToastViewProps) {
  if (!toast) return null;
  return (
    <div
      role="status"
      style={{
        position: 'absolute',
        left: 22,
        right: 22,
        bottom,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'var(--au-ink)',
        color: '#fff',
        borderRadius: 14,
        padding: '13px 15px',
        font: '600 12.5px var(--au-font-text)',
        animation: 'auEnter .3s ease both',
      }}
    >
      <span style={{ fontSize: 15 }} aria-hidden="true">
        {toast.icon}
      </span>
      <span>{toast.message}</span>
    </div>
  );
}
