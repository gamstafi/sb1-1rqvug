import { useState, useEffect } from 'react';
import { Product, PRODUCT_CATEGORIES, PRODUCT_UNITS } from '../types';
import { generateProductReference } from '../utils/products';
import { calculateVAT, calculateTotal } from '../utils/calculations';
import { toast } from 'react-toastify';

interface ProductFormProps {
  onSubmit: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
  initialData?: Product;
  existingProducts: Product[];
}

export default function ProductForm({ onSubmit, onCancel, initialData, existingProducts }: ProductFormProps) {
  const [formData, setFormData] = useState({
    reference: initialData?.reference || '',
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || 'food',
    brand: initialData?.brand || '',
    supplier: initialData?.supplier || '',
    unit: initialData?.unit || 'piece',
    stockQuantity: initialData?.stockQuantity || 0,
    minStockQuantity: initialData?.minStockQuantity || 0,
    purchasePrice: initialData?.purchasePrice || 0,
    sellingPrice: initialData?.sellingPrice || 0,
    vatRate: initialData?.vatRate || 0.2,
    status: initialData?.status || 'active',
    createdAt: initialData?.createdAt || new Date().toISOString(),
    updatedAt: initialData?.updatedAt || new Date().toISOString(),
  });

  useEffect(() => {
    if (!initialData && !formData.reference) {
      const reference = generateProductReference(existingProducts);
      setFormData(prev => ({ ...prev, reference }));
    }
  }, [initialData, formData.reference, existingProducts]);

  const purchaseVAT = calculateVAT(formData.purchasePrice * formData.stockQuantity, formData.vatRate);
  const purchaseTotal = calculateTotal(formData.purchasePrice * formData.stockQuantity, purchaseVAT);
  
  const sellingVAT = calculateVAT(formData.sellingPrice * formData.stockQuantity, formData.vatRate);
  const sellingTotal = calculateTotal(formData.sellingPrice * formData.stockQuantity, sellingVAT);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation des champs obligatoires
    const requiredFields = [
      'reference', 'name', 'category', 'supplier', 'unit',
      'stockQuantity', 'purchasePrice', 'sellingPrice', 'vatRate', 'status'
    ];

    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      toast.error(`Veuillez remplir tous les champs obligatoires : ${missingFields.join(', ')}`);
      return;
    }

    // Validation du stock minimal
    if (formData.minStockQuantity > formData.stockQuantity) {
      toast.error('Le stock minimal ne peut pas être supérieur au stock actuel');
      return;
    }

    // Validation des prix
    if (formData.purchasePrice <= 0 || formData.sellingPrice <= 0) {
      toast.error('Les prix doivent être supérieurs à 0');
      return;
    }

    if (formData.sellingPrice <= formData.purchasePrice) {
      toast.warning('Le prix de vente devrait être supérieur au prix d\'achat');
    }

    const updatedData = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    onSubmit(updatedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Référence du produit *
          </label>
          <input
            type="text"
            value={formData.reference}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            readOnly={!!initialData}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom du produit *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Catégorie *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Marque
          </label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fournisseur *
          </label>
          <input
            type="text"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Unité de mesure *
          </label>
          <select
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            {PRODUCT_UNITS.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantité en stock *
          </label>
          <input
            type="number"
            value={formData.stockQuantity}
            onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stock minimal
          </label>
          <input
            type="number"
            value={formData.minStockQuantity}
            onChange={(e) => setFormData({ ...formData, minStockQuantity: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Prix d'achat unitaire (HT) *
          </label>
          <input
            type="number"
            value={formData.purchasePrice}
            onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Prix de vente unitaire (HT) *
          </label>
          <input
            type="number"
            value={formData.sellingPrice}
            onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Taux de TVA *
          </label>
          <select
            value={formData.vatRate}
            onChange={(e) => setFormData({ ...formData, vatRate: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="0.2">20%</option>
            <option value="0.1">10%</option>
            <option value="0.055">5.5%</option>
            <option value="0">0%</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Statut *
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Prix d'achat total HT:</span>
            <span className="block font-medium">
              {(formData.purchasePrice * formData.stockQuantity).toFixed(2)} €
            </span>
          </div>
          <div>
            <span className="text-gray-500">Prix d'achat total TTC:</span>
            <span className="block font-medium">{purchaseTotal.toFixed(2)} €</span>
          </div>
          <div>
            <span className="text-gray-500">Prix de vente total HT:</span>
            <span className="block font-medium">
              {(formData.sellingPrice * formData.stockQuantity).toFixed(2)} €
            </span>
          </div>
          <div>
            <span className="text-gray-500">Prix de vente total TTC:</span>
            <span className="block font-medium">{sellingTotal.toFixed(2)} €</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {initialData ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
}