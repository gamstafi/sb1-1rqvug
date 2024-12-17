import { useState, useMemo } from 'react';
import { JournalEntry } from '../types';
import { formatCurrency } from '../utils/calculations';
import { validateJournalBalance } from '../utils/accounting/calculations';

interface JournalListProps {
  entries: JournalEntry[];
}

export default function JournalList({ entries }: JournalListProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'all' | 'sale' | 'purchase'>('all');

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesDate = !selectedDate || entry.date === selectedDate;
      const matchesType = selectedType === 'all' || entry.type === selectedType;
      return matchesDate && matchesType;
    });
  }, [entries, selectedDate, selectedType]);

  const totals = useMemo(() => {
    return filteredEntries.reduce((acc, entry) => ({
      debit: acc.debit + (entry.debit || 0),
      credit: acc.credit + (entry.credit || 0),
      vatAmount: acc.vatAmount + entry.vatAmount,
      totalPrice: acc.totalPrice + entry.totalPrice
    }), {
      debit: 0,
      credit: 0,
      vatAmount: 0,
      totalPrice: 0
    });
  }, [filteredEntries]);

  const isBalanced = validateJournalBalance(filteredEntries);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as 'all' | 'sale' | 'purchase')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">Tous</option>
            <option value="sale">Ventes</option>
            <option value="purchase">Achats</option>
          </select>
        </div>
      </div>

      {!isBalanced && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Attention : Le journal n'est pas équilibré
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Compte
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Débit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Crédit
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEntries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(entry.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    entry.type === 'sale'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {entry.type === 'sale' ? 'Vente' : 'Achat'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.accountCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.debit ? formatCurrency(entry.debit) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.credit ? formatCurrency(entry.credit) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Totaux
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatCurrency(totals.debit)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatCurrency(totals.credit)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Total TVA:</span>
            <span className="block font-medium">{formatCurrency(totals.vatAmount)}</span>
          </div>
          <div>
            <span className="text-gray-500">Total TTC:</span>
            <span className="block font-medium">{formatCurrency(totals.totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}