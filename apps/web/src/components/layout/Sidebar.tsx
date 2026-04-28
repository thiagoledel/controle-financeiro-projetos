import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Clientes', path: '/clientes' },
  { label: 'Projetos', path: '/projetos' },
];

// Barra lateral de navegação principal com destaque para a rota ativa.
export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-dark-800 border-r border-white/10 flex flex-col shrink-0">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-base font-bold text-white leading-tight">
          Controle Financeiro
          <br />
          <span className="text-white/50 font-normal text-sm">de Projetos</span>
        </h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-primary-900 text-white font-medium'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
