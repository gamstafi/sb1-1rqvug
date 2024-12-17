import { Product } from '../types';

export const generateProductReference = (existingProducts: Product[]): string => {
  const currentYear = new Date().getFullYear();
  const existingRefsThisYear = existingProducts
    .filter(p => p.reference.startsWith(`PRD-${currentYear}`))
    .map(p => parseInt(p.reference.split('-')[2]));
  
  const nextNumber = existingRefsThisYear.length > 0
    ? Math.max(...existingRefsThisYear) + 1
    : 1;
  
  return `PRD-${currentYear}-${String(nextNumber).padStart(3, '0')}`;
};