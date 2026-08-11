import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { REDEMPTIONS, type RedemptionStatus } from '../data/credit';
import { useToast } from '../components/Toast';

type CreditContextValue = {
  statusFor: (idx: number) => RedemptionStatus;
  setStatus: (idx: number, status: RedemptionStatus) => void;
  toast: ReturnType<typeof useToast>['toast'];
  flash: ReturnType<typeof useToast>['flash'];
};

const CreditContext = createContext<CreditContextValue | null>(null);

export function CreditProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Record<number, RedemptionStatus>>({});
  const { toast, flash } = useToast();

  const value = useMemo<CreditContextValue>(
    () => ({
      statusFor: (idx) => overrides[idx] ?? REDEMPTIONS[idx].status,
      setStatus: (idx, status) => setOverrides((o) => ({ ...o, [idx]: status })),
      toast,
      flash,
    }),
    [overrides, toast, flash],
  );

  return <CreditContext.Provider value={value}>{children}</CreditContext.Provider>;
}

export function useCredit() {
  const ctx = useContext(CreditContext);
  if (!ctx) throw new Error('useCredit must be used within CreditProvider');
  return ctx;
}
