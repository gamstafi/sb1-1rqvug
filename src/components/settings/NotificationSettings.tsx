import { useState } from 'react';
import { NotificationSetting } from '../../types/settings';

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      type: 'email',
      enabled: true,
      frequency: 'daily',
      events: ['low_stock', 'new_transaction'],
    },
  ]);

  const availableEvents = [
    { id: 'low_stock', label: 'Stock bas' },
    { id: 'new_transaction', label: 'Nouvelle transaction' },
    { id: 'tax_deadline', label: 'Échéance fiscale' },
  ];

  const handleSave = () => {
    // Save notification settings
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Paramètres des notifications</h2>

      <div className="space-y-6">
        {settings.map((setting, index) => (
          <div key={setting.type} className="p-4 bg-gray-50 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-medium text-gray-900">
                {setting.type === 'email'
                  ? 'Notifications par email'
                  : setting.type === 'sms'
                  ? 'Notifications SMS'
                  : 'Notifications dans l\'application'}
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={setting.enabled}
                  onChange={(e) => {
                    const newSettings = [...settings];
                    newSettings[index] = {
                      ...setting,
                      enabled: e.target.checked,
                    };
                    setSettings(newSettings);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {setting.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Fréquence
                  </label>
                  <select
                    value={setting.frequency}
                    onChange={(e) => {
                      const newSettings = [...settings];
                      newSettings[index] = {
                        ...setting,
                        frequency: e.target.value as 'realtime' | 'daily' | 'weekly',
                      };
                      setSettings(newSettings);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="realtime">Temps réel</option>
                    <option value="daily">Quotidien</option>
                    <option value="weekly">Hebdomadaire</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Événements
                  </label>
                  <div className="space-y-2">
                    {availableEvents.map((event) => (
                      <label
                        key={event.id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={setting.events.includes(event.id)}
                          onChange={(e) => {
                            const newSettings = [...settings];
                            newSettings[index] = {
                              ...setting,
                              events: e.target.checked
                                ? [...setting.events, event.id]
                                : setting.events.filter((id) => id !== event.id),
                            };
                            setSettings(newSettings);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {event.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
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