export function isHealthyRentBurden(percentage: number): boolean {
  return percentage < 30;
}

export function formatCurrency(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num || 0);
}

export function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
