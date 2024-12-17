import { useState, useMemo } from 'react';
import { Product, Transaction, PaymentMethod, TransactionStatus } from '../types';
import { calculateVAT, calculateTotal } from '../utils/calculations';
import { generateTransactionReference, calculateDiscountedPrice } from '../utils/transactions';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { Search } from 'lucide-react';

interface TransactionFormProps {
  products: Product[];
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  existingTransactions: Transaction[];
}

export default function TransactionForm({ products, onSubmit, existingTransactions }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    type: 'sale' as const,
    productId: '',
    quantity: 1,
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash' as PaymentMethod,
    paymentDetails: {
      checkNumber: '',
      transferReference: '',
      otherDetails: '',
      deferredPayment: {
        installments: 2 as 2 | 3 | 4,
        isPaid: false,
      },
    },
    discount: {
      type: 'percentage' as const,
      value: 0,
    },
    status: 'pending' as TransactionStatus,
    notes: '',
  });

  const [productSearch, setProductSearch] = useState('');

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return sortedProducts.filter(p => 
      p.name.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [sortedProducts, productSearch]);

  const selectedProduct = products.find(p => p.id === formData.productId);
  const price = selectedProduct 
    ? (formData.type === 'sale' ? selectedProduct.sellingPrice : selectedProduct.purchasePrice)
    : 0;
  
  const discountedPrice = calculateDiscountedPrice(
    price * formData.quantity,
    formData.discount.value > 0 ? formData.discount : undefined
  );
  
  const priceBeforeTax = discountedPrice;
  const vatAmount = calculateVAT(priceBeforeTax, selectedProduct?.vatRate || 0);
  const totalPrice = calculateTotal(priceBeforeTax, vatAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    // Vérification du stock pour les ventes
    if (formData.type === 'sale' && formData.quantity > selectedProduct.stockQuantity) {
      toast.error(`Stock insuffisant. Quantité disponible : ${selectedProduct.stockQuantity}`);
      return;
    }

    const reference = generateTransactionReference(existingTransactions);

    onSubmit({
      reference,
      ...formData,
      priceBeforeTax,
      vatAmount,
      totalPrice,
      paymentDetails: formData.paymentMethod !== 'cash' ? formData.paymentDetails : undefined,
    });

    // Reset form
    setFormData(prev => ({
      ...prev,
      productId: '',
      quantity: 1,
      paymentMethod: 'cash',
      paymentDetails: {
        checkNumber: '',
        transferReference: '',
        otherDetails: '',
        deferredPayment: {
          installments: 2,
          isPaid: false,
        },
      },
      discount: {
        type: 'percentage',
        value: 0,
      },
      notes: '',
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type de transaction
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'sale' | 'purchase' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="sale">Vente</option>
            <option value="purchase">Achat</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Produit
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <select
            value={formData.productId}
            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionner un produit</option>
            {filteredProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - Stock: {product.stockQuantity}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantité
          </label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mode de règlement
          </label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="cash">Espèces</option>
            <option value="check">Chèques</option>
            <option value="bank_transfer">Virements bancaires</option>
            <option value="credit_card">Cartes bancaires</option>
            <option value="deferred">Paiements différés</option>
            <option value="other">Autres</option>
          </select>
        </div>

        {formData.paymentMethod === 'check' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Numéro de chèque
            </label>
            <input
              type="text"
              value={formData.paymentDetails.checkNumber}
              onChange={(e) => setFormData({
                ...formData,
                paymentDetails: { ...formData.paymentDetails, checkNumber: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        )}

        {formData.paymentMethod === 'bank_transfer' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Référence du virement
            </label>
            <input
              type="text"
              value={formData.paymentDetails.transferReference}
              onChange={(e) => setFormData({
                ...formData,
                paymentDetails: { ...formData.paymentDetails, transferReference: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        )}

        {formData.paymentMethod === 'deferred' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre d'échéances
              </label>
              <select
                value={formData.paymentDetails.deferredPayment.installments}
                onChange={(e) => setFormData({
                  ...formData,
                  paymentDetails: {
                    ...formData.paymentDetails,
                    deferredPayment: {
                      ...formData.paymentDetails.deferredPayment,
                      installments: Number(e.target.value) as 2 | 3 | 4
                    }
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value={2}>2 fois</option>
                <option value={3}>3 fois</option>
                <option value={4}>4 fois</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.paymentDetails.deferredPayment.isPaid}
                onChange={(e) => setFormData({
                  ...formData,
                  paymentDetails: {
                    ...formData.paymentDetails,
                    deferredPayment: {
                      ...formData.paymentDetails.deferredPayment,
                      isPaid: e.target.checked
                    }
                  }
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Déjà réglé
              </label>
            </div>
          </div>
        )}

        {formData.paymentMethod === 'other' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Détails du paiement
            </label>
            <input
              type="text"
              value={formData.paymentDetails.otherDetails}
              onChange={(e) => setFormData({
                ...formData,
                paymentDetails: { ...formData.paymentDetails, otherDetails: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type de remise
          </label>
          <select
            value={formData.discount.type}
            onChange={(e) => setFormData({
              ...formData,
              discount: { ...formData.discount, type: e.target.value as 'percentage' | 'fixed' }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="percentage">Pourcentage (%)</option>
            <option value="fixed">Montant fixe</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Valeur de la remise
          </label>
          <input
            type="number"
            value={formData.discount.value}
            onChange={(e) => setFormData({
              ...formData,
              discount: { ...formData.discount, value: Number(e.target.value) }
            })}
            min="0"
            max={formData.discount.type === 'percentage' ? 100 : undefined}
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Statut
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as TransactionStatus })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Informations supplémentaires..."
          />
        </div>
      </div>

      <div className="mt-4 bg-gray-50 p-4 rounded-md">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Montant initial:</span>
            <span className="block font-medium">{(price * formData.quantity).toFixed(2)} €</span>
          </div>
          <div>
            <span className="text-gray-500">Remise:</span>
            <span className="block font-medium">
              {(price * formData.quantity - discountedPrice).toFixed(2)} €
            </span>
          </div>
          <div>
            <span className="text-gray-500">TVA:</span>
            <span className="block font-medium">{vatAmount.toFixed(2)} €</span>
          </div>
          <div>
            <span className="text-gray-500">Total TTC:</span>
            <span className="block font-medium">{totalPrice.toFixed(2)} €</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Enregistrer la transaction
        </button>
      </div>
    </form>
  );
}