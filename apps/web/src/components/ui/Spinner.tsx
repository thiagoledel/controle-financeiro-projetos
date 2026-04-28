interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

// Indicador de carregamento circular animado.
export function Spinner({ size = 'md' }: SpinnerProps) {
  return (
    <div
      className={`${sizeClasses[size]} border-2 border-white/20 border-t-primary-700 rounded-full animate-spin`}
    />
  );
}
