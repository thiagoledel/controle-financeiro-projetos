import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'danger' | 'ghost' | 'secondary';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-primary-700 hover:bg-primary-900 text-white',
  danger:    'bg-danger-500 hover:bg-danger-900 text-white',
  ghost:     'hover:bg-white/10 text-white/70 hover:text-white',
  secondary: 'bg-transparent hover:bg-white/10 text-white border border-white/20',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

// Botão reutilizável com variantes visuais, tamanhos e indicador de carregamento.
// Quando isLoading=true o botão é desabilitado automaticamente.
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', isLoading, children, className = '', disabled, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled ?? isLoading}
      className={`rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {isLoading && (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      )}
      {children}
    </button>
  ),
);
Button.displayName = 'Button';
