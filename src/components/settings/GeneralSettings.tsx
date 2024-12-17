import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { languages, currencies, timezones, dateFormats, numberFormats } from '../../utils/settingsOptions';

export default function GeneralSettings() {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState({
    language: languages.find(l => l.value === i18n.language) || languages[0],
    theme: 'light',
    currency: currencies.find(c => c.value === 'EUR'),
    timezone: timezones.find(t => t.value === Intl.DateTimeFormat().resolvedOptions().timeZone),
    dateFormat: dateFormats[0],
    numberFormat: numberFormats[0],
  });

  const handleSave = async () => {
    // Save settings to backend/localStorage
    await i18n.changeLanguage(settings.language.value);
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    // Additional save logic...
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Paramètres généraux</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Langue</label>
          <Select
            value={settings.language}
            onChange={(value) => setSettings({ ...settings, language: value! })}
            options={languages}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Thème</label>
          <select
            value={settings.theme}
            onChange={(e) => setSettings({ ...settings, theme: e.target.value as 'light' | 'dark' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Devise</label>
          <Select
            value={settings.currency}
            onChange={(value) => setSettings({ ...settings, currency: value! })}
            options={currencies}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fuseau horaire</label>
          <Select
            value={settings.timezone}
            onChange={(value) => setSettings({ ...settings, timezone: value! })}
            options={timezones}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Format de date</label>
          <Select
            value={settings.dateFormat}
            onChange={(value) => setSettings({ ...settings, dateFormat: value! })}
            options={dateFormats}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Format des nombres</label>
          <Select
            value={settings.numberFormat}
            onChange={(value) => setSettings({ ...settings, numberFormat: value! })}
            options={numberFormats}
            className="mt-1"
          />
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