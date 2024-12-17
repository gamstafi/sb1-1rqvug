import { useState } from 'react';
import Select from 'react-select';
import { accountingPlans } from '../../utils/settingsOptions';
import { AccountingPlan } from '../../types/settings';

export default function AccountingSettings() {
  const [selectedPlan, setSelectedPlan] = useState(accountingPlans[0]);
  const [customPlan, setCustomPlan] = useState<Partial<AccountingPlan>>({
    name: '',
    code: '',
    accounts: [],
  });
  const [showCustomForm, setShowCustomForm] = useState(false);

  const handleSave = () => {
    // Save accounting plan settings
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Paramètres comptables</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Plan comptable
          </label>
          <Select
            value={selectedPlan}
            onChange={(value) => {
              if (value?.id === 'custom') {
                setShowCustomForm(true);
              } else {
                setSelectedPlan(value!);
                setShowCustomForm(false);
              }
            }}
            options={[
              ...accountingPlans,
              { id: 'custom', name: 'Plan personnalisé', code: 'CUSTOM' },
            ]}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            className="mt-1"
          />
        </div>

        {showCustomForm && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
            <h3 className="text-md font-medium text-gray-900">
              Configuration du plan personnalisé
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom du plan
              </label>
              <input
                type="text"
                value={customPlan.name}
                onChange={(e) =>
                  setCustomPlan({ ...customPlan, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Code du plan
              </label>
              <input
                type="text"
                value={customPlan.code}
                onChange={(e) =>
                  setCustomPlan({ ...customPlan, code: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
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