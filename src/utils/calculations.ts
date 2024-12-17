export const calculateVAT = (price: number, vatRate: number): number => {
  return price * vatRate;
};

export const calculateTotal = (price: number, vatAmount: number): number => {
  return price + vatAmount;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};