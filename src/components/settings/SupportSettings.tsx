import { useState } from 'react';
import { HelpCircle, Book, MessageCircle, Bug } from 'lucide-react';

export default function SupportSettings() {
  const [issue, setIssue] = useState('');

  const handleSubmitIssue = () => {
    // Submit issue logic
    setIssue('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Support et assistance</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Book className="h-5 w-5 text-gray-600" />
            <h3 className="text-md font-medium text-gray-900">Documentation</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Consultez notre documentation complète pour apprendre à utiliser toutes les fonctionnalités.
          </p>
          <a
            href="#"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Accéder à la documentation →
          </a>
        </div>

        <div className="p-6 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <MessageCircle className="h-5 w-5 text-gray-600" />
            <h3 className="text-md font-medium text-gray-900">Support technique</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Besoin d'aide ? Notre équipe de support est là pour vous aider.
          </p>
          <a
            href="mailto:support@example.com"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Contacter le support →
          </a>
        </div>
      </div>

      <div className="p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-4">
          <Bug className="h-5 w-5 text-gray-600" />
          <h3 className="text-md font-medium text-gray-900">Signaler un problème</h3>
        </div>
        <div className="space-y-4">
          <textarea
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            placeholder="Décrivez le problème rencontré..."
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            onClick={handleSubmitIssue}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}