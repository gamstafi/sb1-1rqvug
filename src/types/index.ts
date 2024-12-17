export interface Product {
  id: string;
  reference: string;
  name: string;
  description: string;
  category: ProductCategory;
  brand?: string;
  supplier: string;
  unit: string;
  stockQuantity: number;
  minStockQuantity?: number;
  purchasePrice: number;
  sellingPrice: number;
  vatRate: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export type ProductCategory = 
  | 'food'
  | 'electronics'
  | 'clothing'
  | 'beauty'
  | 'household'
  | 'technology'
  | 'sports';

export type PaymentMethod = 
  | 'cash'
  | 'check'
  | 'bank_transfer'
  | 'credit_card'
  | 'deferred'
  | 'other';

export type TransactionStatus = 
  | 'confirmed'
  | 'pending'
  | 'cancelled';

export interface Transaction {
  id: string;
  reference: string;
  type: 'purchase' | 'sale';
  date: string;
  productId: string;
  quantity: number;
  priceBeforeTax: number;
  vatAmount: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  paymentDetails?: {
    checkNumber?: string;
    transferReference?: string;
    otherDetails?: string;
    deferredPayment?: {
      installments: 2 | 3 | 4;
      isPaid: boolean;
    };
  };
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  status: TransactionStatus;
  notes?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  type: 'purchase' | 'sale';
  accountCode: string;
  description: string;
  priceBeforeTax: number;
  vatAmount: number;
  totalPrice: number;
}

export const PRODUCT_CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'food', label: 'Produits alimentaires' },
  { value: 'electronics', label: 'Produits électroniques' },
  { value: 'clothing', label: 'Produits vestimentaires' },
  { value: 'beauty', label: 'Produits de beauté et hygiène' },
  { value: 'household', label: 'Produits ménagers' },
  { value: 'technology', label: 'Produits technologiques' },
  { value: 'sports', label: 'Produits de loisirs et sports' },
];

export const PRODUCT_UNITS = [
  { value: 'piece', label: 'Pièce' },
  { value: 'kg', label: 'Kilogramme' },
  { value: 'g', label: 'Gramme' },
  { value: 'l', label: 'Litre' },
  { value: 'ml', label: 'Millilitre' },
  { value: 'm', label: 'Mètre' },
  { value: 'cm', label: 'Centimètre' },
  { value: 'm2', label: 'Mètre carré' },
  { value: 'm3', label: 'Mètre cube' },
  { value: 'box', label: 'Boîte' },
  { value: 'pack', label: 'Pack' },
];