import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

// Select reutilizável com label e lista de opções dinâmicas.
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-white/80">{label}</label>
      )}
      <select
        ref={ref}
        className={`bg-dark-800 border ${
          error ? 'border-danger-500' : 'border-white/20'
        } rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-700 transition-colors text-sm ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-dark-800">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-danger-300">{error}</span>}
    </div>
  ),
);
Select.displayName = 'Select';
