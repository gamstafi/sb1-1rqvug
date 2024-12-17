import { Transaction, JournalEntry, PaymentMethod } from '../../types';
import { calculateVATAmount, calculateTotalAmount } from './calculations';

interface AccountingEntry {
  accountCode: string;
  description: string;
  debit: number;
  credit: number;
}

const getAccountingEntries = (
  transaction: Transaction,
  vatAmount: number,
  totalAmount: number
): AccountingEntry[] => {
  const entries: AccountingEntry[] = [];

  // Pour une vente de 450€ HT avec TVA 20% (90€) = 540€ TTC
  if (transaction.type === 'sale') {
    // Débit compte Client (411) du montant TTC
    entries.push({
      accountCode: '411',
      description: 'Créance client',
      debit: totalAmount, // 540.00
      credit: 0
    });

    // Crédit compte TVA collectée (445711) du montant de la TVA
    entries.push({
      accountCode: '445711',
      description: 'TVA collectée',
      debit: 0,
      credit: vatAmount // 90.00
    });

    // Crédit compte Ventes (707) du montant HT
    entries.push({
      accountCode: '707',
      description: 'Vente de marchandises',
      debit: 0,
      credit: transaction.priceBeforeTax // 450.00
    });

    // Si paiement immédiat
    if (transaction.paymentMethod) {
      const paymentEntry = createPaymentEntry(
        transaction.paymentMethod,
        totalAmount,
        'sale'
      );
      if (paymentEntry) {
        entries.push(paymentEntry);
        // Contre-passation de la créance client
        entries.push({
          accountCode: '411',
          description: 'Règlement client',
          debit: 0,
          credit: totalAmount // 540.00
        });
      }
    }
  } else {
    // Pour un achat, même logique avec les comptes inversés
    entries.push({
      accountCode: '401',
      description: 'Dette fournisseur',
      debit: 0,
      credit: totalAmount
    });

    entries.push({
      accountCode: '445662',
      description: 'TVA déductible',
      debit: vatAmount,
      credit: 0
    });

    entries.push({
      accountCode: '607',
      description: 'Achat de marchandises',
      debit: transaction.priceBeforeTax,
      credit: 0
    });

    if (transaction.paymentMethod) {
      const paymentEntry = createPaymentEntry(
        transaction.paymentMethod,
        totalAmount,
        'purchase'
      );
      if (paymentEntry) {
        entries.push(paymentEntry);
        entries.push({
          accountCode: '401',
          description: 'Règlement fournisseur',
          debit: totalAmount,
          credit: 0
        });
      }
    }
  }

  return entries;
};

const createPaymentEntry = (
  paymentMethod: PaymentMethod,
  amount: number,
  type: 'sale' | 'purchase'
): AccountingEntry | null => {
  const isSale = type === 'sale';
  
  switch (paymentMethod) {
    case 'cash':
      return {
        accountCode: '531',
        description: 'Caisse',
        debit: isSale ? amount : 0,
        credit: isSale ? 0 : amount
      };
    case 'bank_transfer':
    case 'credit_card':
      return {
        accountCode: '512',
        description: 'Banque',
        debit: isSale ? amount : 0,
        credit: isSale ? 0 : amount
      };
    case 'check':
      return {
        accountCode: '511',
        description: 'Chèques à encaisser',
        debit: isSale ? amount : 0,
        credit: isSale ? 0 : amount
      };
    default:
      return null;
  }
};

export const createJournalEntries = (transaction: Transaction): JournalEntry[] => {
  const vatAmount = calculateVATAmount(transaction.priceBeforeTax, transaction.vatAmount);
  const totalAmount = calculateTotalAmount(transaction.priceBeforeTax, vatAmount);
  
  const entries = getAccountingEntries(transaction, vatAmount, totalAmount);
  
  return entries.map((entry, index) => ({
    id: `${transaction.id}-${index}`,
    date: transaction.date,
    type: transaction.type,
    accountCode: entry.accountCode,
    description: entry.description,
    priceBeforeTax: transaction.priceBeforeTax,
    vatAmount: vatAmount,
    totalPrice: totalAmount,
    debit: entry.debit,
    credit: entry.credit
  }));
};