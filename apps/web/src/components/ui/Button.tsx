import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-primary-700 hover:bg-primary-900 text-white',
  secondary: 'bg-transparent hover:bg-white/10 text-white border border-white/20',
  danger:    'bg-danger-500 hover:bg-danger-900 text-white',
  ghost:     'hover:bg-white/10 text-white/70 hover:text-white',
};

// Botão reutilizável com variantes visuais e indicador de carregamento.
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', isLoading, children, className = '', disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled ?? isLoading}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
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
