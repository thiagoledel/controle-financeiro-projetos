// Formata um valor numérico como moeda BRL (ex: 1234.5 → "R$ 1.234,50").
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Formata um número como percentual (ex: 42.5 → "42,50%").
// O valor deve estar em escala 0-100 (não 0-1).
export function formatPercent(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

// Formata uma string de data ISO para o padrão brasileiro (dd/mm/aaaa).
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(dateStr));
}
