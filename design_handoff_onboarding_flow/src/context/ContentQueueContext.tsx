import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fetchContentQueue, type ContentQueueItem } from '../lib/queries/content';
import { useToast } from '../components/Toast';

type ContentQueueContextValue = {
  items: ContentQueueItem[] | null;
  reload: () => Promise<void>;
  toast: ReturnType<typeof useToast>['toast'];
  flash: ReturnType<typeof useToast>['flash'];
};

const ContentQueueContext = createContext<ContentQueueContextValue | null>(null);

export function ContentQueueProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ContentQueueItem[] | null>(null);
  const { toast, flash } = useToast();

  const reload = useCallback(async () => {
    const data = await fetchContentQueue();
    setItems(data);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const value = useMemo<ContentQueueContextValue>(() => ({ items, reload, toast, flash }), [items, reload, toast, flash]);

  return <ContentQueueContext.Provider value={value}>{children}</ContentQueueContext.Provider>;
}

export function useContentQueue() {
  const ctx = useContext(ContentQueueContext);
  if (!ctx) throw new Error('useContentQueue must be used within ContentQueueProvider');
  return ctx;
}
