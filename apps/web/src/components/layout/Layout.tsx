import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

// Layout principal: barra lateral fixa + área de conteúdo rolável.
export default function Layout() {
  return (
    <div className="flex min-h-screen bg-dark-900">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
