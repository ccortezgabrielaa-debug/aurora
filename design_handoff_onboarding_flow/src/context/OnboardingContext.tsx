import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type OnboardingState = {
  name: string;
  email: string;
  pass: string;
  brand: string;
  billingEmail: string;
  cnpj: string;
  instagramHandle: string;
  color: string;
  logoUrl: string | null;
};

type OnboardingContextValue = {
  state: OnboardingState;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  setPass: (v: string) => void;
  setBrand: (v: string) => void;
  setBillingEmail: (v: string) => void;
  setCnpj: (v: string) => void;
  setInstagramHandle: (v: string) => void;
  setColor: (v: string) => void;
  setLogoUrl: (v: string | null) => void;
  reset: () => void;
};

const INITIAL_STATE: OnboardingState = {
  name: '',
  email: '',
  pass: '',
  brand: 'Aurora Studio',
  billingEmail: '',
  cnpj: '',
  instagramHandle: '',
  color: '#eab4bf',
  logoUrl: null,
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      state,
      setName: (name) => setState((s) => ({ ...s, name })),
      setEmail: (email) => setState((s) => ({ ...s, email })),
      setPass: (pass) => setState((s) => ({ ...s, pass })),
      setBrand: (brand) => setState((s) => ({ ...s, brand })),
      setBillingEmail: (billingEmail) => setState((s) => ({ ...s, billingEmail })),
      setCnpj: (cnpj) => setState((s) => ({ ...s, cnpj })),
      setInstagramHandle: (instagramHandle) => setState((s) => ({ ...s, instagramHandle })),
      setColor: (color) => setState((s) => ({ ...s, color })),
      setLogoUrl: (logoUrl) => setState((s) => ({ ...s, logoUrl })),
      reset: () => setState(INITIAL_STATE),
    }),
    [state],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}
