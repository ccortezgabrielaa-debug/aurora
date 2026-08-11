import { useLocation, useNavigate } from 'react-router-dom';
import { BottomTabBar } from './BottomTabBar';

const ROUTE_TABS = [
  { label: 'Início', icon: '⌂', path: '/dashboard' },
  { label: 'Embaixadoras', icon: '◍', path: '/embaixadoras' },
  { label: 'Conteúdo', icon: '▤', path: '/conteudo' },
  { label: 'Crédito', icon: '◈', path: '/credito' },
];

/** Persistent bottom nav for the 4 root Marca screens (Dashboard, Embaixadoras, Conteúdo, Crédito). */
export function MarcaTabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const active = ROUTE_TABS.find((t) => location.pathname.startsWith(t.path))?.label ?? 'Início';

  return (
    <BottomTabBar
      tabs={ROUTE_TABS}
      active={active}
      onChange={(label) => {
        const tab = ROUTE_TABS.find((t) => t.label === label);
        if (tab) navigate(tab.path);
      }}
    />
  );
}
