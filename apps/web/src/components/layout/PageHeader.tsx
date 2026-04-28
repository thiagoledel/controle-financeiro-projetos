import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

// Cabeçalho padrão de página com título, subtítulo opcional e área de ações.
export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-white/50 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2 shrink-0 ml-4">{actions}</div>}
    </div>
  );
}
