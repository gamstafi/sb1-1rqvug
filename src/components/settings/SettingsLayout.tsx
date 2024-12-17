import { useState } from 'react';
import { Settings, Globe, Moon, Calculator, Tags, Users, Bell, Cloud, HelpCircle } from 'lucide-react';
import GeneralSettings from './GeneralSettings';
import AccountingSettings from './AccountingSettings';
import ProductSettings from './ProductSettings';
import UserSettings from './UserSettings';
import NotificationSettings from './NotificationSettings';
import IntegrationSettings from './IntegrationSettings';
import SupportSettings from './SupportSettings';

const tabs = [
  { id: 'general', icon: Globe, label: 'Général' },
  { id: 'accounting', icon: Calculator, label: 'Comptabilité' },
  { id: 'products', icon: Tags, label: 'Produits' },
  { id: 'users', icon: Users, label: 'Utilisateurs' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'integrations', icon: Cloud, label: 'Intégrations' },
  { id: 'support', icon: HelpCircle, label: 'Support' },
];

export default function SettingsLayout() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 mb-6">
          <Settings className="h-6 w-6 text-gray-600" />
          <h1 className="text-2xl font-semibold text-gray-900">Paramètres</h1>
        </div>

        <div className="flex space-x-6">
          <div className="w-64 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 bg-white rounded-lg shadow p-6">
            {activeTab === 'general' && <GeneralSettings />}
            {activeTab === 'accounting' && <AccountingSettings />}
            {activeTab === 'products' && <ProductSettings />}
            {activeTab === 'users' && <UserSettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'integrations' && <IntegrationSettings />}
            {activeTab === 'support' && <SupportSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}