// Calculs de base pour la comptabilité
export const calculateVATAmount = (priceBeforeTax: number, vatRate: number): number => {
  return Number((priceBeforeTax * vatRate).toFixed(2));
};

export const calculateTotalAmount = (priceBeforeTax: number, vatAmount: number): number => {
  return Number((priceBeforeTax + vatAmount).toFixed(2));
};

// Validation des montants
export const validateAmounts = (
  priceBeforeTax: number,
  vatAmount: number,
  totalAmount: number,
  vatRate: number
): boolean => {
  const calculatedVAT = calculateVATAmount(priceBeforeTax, vatRate);
  const calculatedTotal = calculateTotalAmount(priceBeforeTax, calculatedVAT);
  
  return Math.abs(calculatedVAT - vatAmount) < 0.01 && 
         Math.abs(calculatedTotal - totalAmount) < 0.01;
};

// Vérification de l'équilibre des écritures
export const validateJournalBalance = (entries: Array<{ debit: number; credit: number }>): boolean => {
  const totalDebit = entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
  const totalCredit = entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
  
  return Math.abs(totalDebit - totalCredit) < 0.01;
};