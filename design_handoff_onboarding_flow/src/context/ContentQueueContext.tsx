import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { CONTENT_QUEUE, type ContentQueueStatus } from '../data/contentQueue';
import { useToast } from '../components/Toast';

type ContentQueueContextValue = {
  statusFor: (idx: number) => ContentQueueStatus;
  setStatus: (idx: number, status: ContentQueueStatus) => void;
  toast: ReturnType<typeof useToast>['toast'];
  flash: ReturnType<typeof useToast>['flash'];
};

const ContentQueueContext = createContext<ContentQueueContextValue | null>(null);

export function ContentQueueProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Record<number, ContentQueueStatus>>({});
  const { toast, flash } = useToast();

  const value = useMemo<ContentQueueContextValue>(
    () => ({
      statusFor: (idx) => overrides[idx] ?? CONTENT_QUEUE[idx].status,
      setStatus: (idx, status) => setOverrides((o) => ({ ...o, [idx]: status })),
      toast,
      flash,
    }),
    [overrides, toast, flash],
  );

  return <ContentQueueContext.Provider value={value}>{children}</ContentQueueContext.Provider>;
}

export function useContentQueue() {
  const ctx = useContext(ContentQueueContext);
  if (!ctx) throw new Error('useContentQueue must be used within ContentQueueProvider');
  return ctx;
}
