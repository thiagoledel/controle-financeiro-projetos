type BadgeVariant = 'blue' | 'green' | 'red' | 'gray';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  blue:  'bg-primary-900/30 text-primary-300',
  green: 'bg-success-700/30 text-success-500',
  red:   'bg-danger-900/30 text-danger-300',
  gray:  'bg-white/10 text-white/60',
};

// Badge de status ou categoria com variantes de cor.
export function Badge({ label, variant = 'gray' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]}`}
    >
      {label}
    </span>
  );
}
