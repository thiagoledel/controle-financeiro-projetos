import { Component, ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/layout/Layout';
import ClientesPage from './pages/clientes/ClientesPage';
import ClienteDetalhePage from './pages/clientes/ClienteDetalhePage';
import ProjetosPage from './pages/projetos/ProjetosPage';
import ProjetoDetalhePage from './pages/projetos/ProjetoDetalhePage';
import NotFoundPage from './pages/NotFoundPage';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-dark-950 p-8">
          <div className="text-center max-w-md">
            <p className="text-5xl mb-4">⚠️</p>
            <h1 className="text-xl font-semibold text-white mb-2">Algo deu errado</h1>
            <p className="text-white/50 text-sm mb-6">{this.state.message}</p>
            <button
              className="px-4 py-2 bg-primary-700 hover:bg-primary-900 text-white rounded-lg text-sm font-medium transition-colors"
              onClick={() => window.location.reload()}
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
