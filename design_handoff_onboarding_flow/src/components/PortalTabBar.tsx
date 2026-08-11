import { useLocation, useNavigate } from 'react-router-dom';
import { BottomTabBar } from './BottomTabBar';

const PORTAL_TABS = [
  { label: 'Início', icon: '⌂', path: '/portal' },
  { label: 'Vendas', icon: '↑', path: '/portal/vendas' },
  { label: 'Conteúdo', icon: '▤', path: '/portal/conteudo' },
  { label: 'Crédito', icon: '◈', path: '/portal/credito' },
];

/** Bottom nav for the 4 Portal da Embaixadora tabs. */
export function PortalTabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const active = [...PORTAL_TABS].reverse().find((t) => location.pathname.startsWith(t.path))?.label ?? 'Início';

  return (
    <BottomTabBar
      tabs={PORTAL_TABS}
      active={active}
      onChange={(label) => {
        const tab = PORTAL_TABS.find((t) => t.label === label);
        if (tab) navigate(tab.path);
      }}
    />
  );
}
