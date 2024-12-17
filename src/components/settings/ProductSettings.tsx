import { useState } from 'react';
import { ProductCategory, VatRate } from '../../types/settings';

export default function ProductSettings() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [vatRates, setVatRates] = useState<VatRate[]>([]);
  const [newCategory, setNewCategory] = useState<Partial<ProductCategory>>({});
  const [newVatRate, setNewVatRate] = useState<Partial<VatRate>>({});

  const handleSave = () => {
    // Save product settings
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Paramètres des produits</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">Catégories de produits</h3>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <span>{category.name}</span>
                <button className="text-red-600 hover:text-red-800">
                  Supprimer
                </button>
              </div>
            ))}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Nouvelle catégorie"
                value={newCategory.name || ''}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">Taux de TVA</h3>
          <div className="space-y-4">
            {vatRates.map((rate) => (
              <div key={rate.id} className="flex items-center justify-between">
                <span>
                  {rate.name} ({(rate.rate * 100).toFixed(1)}%)
                </span>
                <button className="text-red-600 hover:text-red-800">
                  Supprimer
                </button>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nom du taux"
                value={newVatRate.name || ''}
                onChange={(e) =>
                  setNewVatRate({ ...newVatRate, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Taux (%)"
                value={newVatRate.rate || ''}
                onChange={(e) =>
                  setNewVatRate({
                    ...newVatRate,
                    rate: Number(e.target.value) / 100,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}