import { format } from 'date-fns';

export const generateTransactionReference = (existingTransactions: { reference: string }[]): string => {
  const currentYear = new Date().getFullYear();
  const existingRefsThisYear = existingTransactions
    .filter(t => t.reference.startsWith(`TRX-${currentYear}`))
    .map(t => parseInt(t.reference.split('-')[2]));
  
  const nextNumber = existingRefsThisYear.length > 0
    ? Math.max(...existingRefsThisYear) + 1
    : 1;
  
  return `TRX-${currentYear}-${String(nextNumber).padStart(3, '0')}`;
};

export const calculateDiscountedPrice = (
  price: number,
  discount?: { type: 'percentage' | 'fixed'; value: number }
): number => {
  if (!discount) return price;
  
  if (discount.type === 'percentage') {
    return price * (1 - discount.value / 100);
  } else {
    return Math.max(0, price - discount.value);
  }
};