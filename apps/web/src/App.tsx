import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/layout/Layout';
import ClientesPage from './pages/clientes/ClientesPage';
import ClienteDetalhePage from './pages/clientes/ClienteDetalhePage';
import ProjetosPage from './pages/projetos/ProjetosPage';
import ProjetoDetalhePage from './pages/projetos/ProjetoDetalhePage';
import NotFoundPage from './pages/NotFoundPage';

// Componente raiz: define o roteamento e o Toaster global de notificações.
export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<ClientesPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/clientes/:id" element={<ClienteDetalhePage />} />
          <Route path="/projetos" element={<ProjetosPage />} />
          <Route path="/projetos/:id" element={<ProjetoDetalhePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
