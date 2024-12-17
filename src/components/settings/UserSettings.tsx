import { useState } from 'react';
import { UserRole, Permission } from '../../types/settings';

export default function UserSettings() {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [newRole, setNewRole] = useState<Partial<UserRole>>({});
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const defaultPermissions: Permission[] = [
    { id: 'read_inventory', name: 'Lecture inventaire', description: 'Voir les produits' },
    { id: 'write_inventory', name: 'Écriture inventaire', description: 'Modifier les produits' },
    { id: 'read_transactions', name: 'Lecture transactions', description: 'Voir les transactions' },
    { id: 'write_transactions', name: 'Écriture transactions', description: 'Créer des transactions' },
  ];

  const handleSave = () => {
    // Save user settings
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Gestion des utilisateurs</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">Rôles</h3>
          <div className="space-y-4">
            {roles.map((role) => (
              <div
                key={role.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <span className="font-medium">{role.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => setSelectedRole(role)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Modifier
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <input
              type="text"
              placeholder="Nouveau rôle"
              value={newRole.name || ''}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {selectedRole && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-md font-medium text-gray-900 mb-4">
              Permissions pour {selectedRole.name}
            </h3>
            <div className="space-y-2">
              {defaultPermissions.map((permission) => (
                <label key={permission.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedRole.permissions.some(
                      (p) => p.id === permission.id
                    )}
                    onChange={() => {
                      // Toggle permission
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {permission.name}
                  </span>
                </label>
              ))}
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