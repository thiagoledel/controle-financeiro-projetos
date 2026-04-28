import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

// Campo de texto reutilizável com label integrado e exibição de erro.
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-white/80">{label}</label>
      )}
      <input
        ref={ref}
        className={`bg-dark-800 border ${
          error ? 'border-danger-500' : 'border-white/20'
        } rounded-lg px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-primary-700 transition-colors text-sm ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-danger-300">{error}</span>}
    </div>
  ),
);
Input.displayName = 'Input';
