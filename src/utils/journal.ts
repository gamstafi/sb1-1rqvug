import { Transaction, JournalEntry } from '../types';

export const createJournalEntries = (transaction: Transaction): JournalEntry[] => {
  const baseEntry: Partial<JournalEntry> = {
    date: transaction.date,
    type: transaction.type,
    priceBeforeTax: transaction.priceBeforeTax,
    vatAmount: transaction.vatAmount,
    totalPrice: transaction.totalPrice,
  };

  if (transaction.type === 'sale') {
    return [
      {
        ...baseEntry,
        id: `${transaction.id}-client`,
        accountCode: '411',
        description: 'Créance client',
        type: 'sale',
      },
      {
        ...baseEntry,
        id: `${transaction.id}-vente`,
        accountCode: '707',
        description: 'Vente de marchandises',
        type: 'sale',
      },
      {
        ...baseEntry,
        id: `${transaction.id}-tva`,
        accountCode: '445711',
        description: 'TVA collectée',
        type: 'sale',
      },
    ] as JournalEntry[];
  } else {
    return [
      {
        ...baseEntry,
        id: `${transaction.id}-achat`,
        accountCode: '607',
        description: 'Achat de marchandises',
        type: 'purchase',
      },
      {
        ...baseEntry,
        id: `${transaction.id}-tva`,
        accountCode: '445662',
        description: 'TVA déductible',
        type: 'purchase',
      },
      {
        ...baseEntry,
        id: `${transaction.id}-fournisseur`,
        accountCode: '401',
        description: 'Dette fournisseur',
        type: 'purchase',
      },
    ] as JournalEntry[];
  }
};