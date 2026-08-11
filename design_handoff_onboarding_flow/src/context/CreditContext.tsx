import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fetchRedemptions, type RedemptionItem } from '../lib/queries/credit';
import { useToast } from '../components/Toast';

type CreditContextValue = {
  redemptions: RedemptionItem[] | null;
  reload: () => Promise<void>;
  toast: ReturnType<typeof useToast>['toast'];
  flash: ReturnType<typeof useToast>['flash'];
};

const CreditContext = createContext<CreditContextValue | null>(null);

export function CreditProvider({ children }: { children: ReactNode }) {
  const [redemptions, setRedemptions] = useState<RedemptionItem[] | null>(null);
  const { toast, flash } = useToast();

  const reload = useCallback(async () => {
    const data = await fetchRedemptions();
    setRedemptions(data);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const value = useMemo<CreditContextValue>(() => ({ redemptions, reload, toast, flash }), [redemptions, reload, toast, flash]);

  return <CreditContext.Provider value={value}>{children}</CreditContext.Provider>;
}

export function useCredit() {
  const ctx = useContext(CreditContext);
  if (!ctx) throw new Error('useCredit must be used within CreditProvider');
  return ctx;
}
