export interface AccountingEntry {
  id: string;
  date: string;
  accountCode: string;
  description: string;
  debit: number;
  credit: number;
  type: 'sale' | 'purchase';
}

export interface JournalBalance {
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
}

export interface AccountingTotals {
  debit: number;
  credit: number;
  vatAmount: number;
  totalPrice: number;
}