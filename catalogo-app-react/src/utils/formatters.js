// Utility formatter for Mexican Pesos (MXN)
export const formatPrice = (val) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val || 0);
};
