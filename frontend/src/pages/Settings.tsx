import { API_URL } from '../config';
import { useState } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    aiPersonality: 'professional',
    autoResponse: true,
    emailNotifications: true,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Instellingen</h1>
        <p className="text-gray-600 mt-1">Configureer je AI agent</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">AI Agent Instellingen</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Persoonlijkheid
            </label>
            <select
              value={settings.aiPersonality}
              onChange={(e) => setSettings({ ...settings, aiPersonality: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="professional">Professioneel & Vriendelijk</option>
              <option value="business">Zakelijk & Direct</option>
              <option value="casual">Casual & Toegankelijk</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Automatische Antwoorden</p>
              <p className="text-sm text-gray-500">AI reageert automatisch op nieuwe berichten</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, autoResponse: !settings.autoResponse })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.autoResponse ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.autoResponse ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Notificaties</p>
              <p className="text-sm text-gray-500">Ontvang updates over nieuwe leads</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Opslaan
        </button>
      </div>
    </div>
  );
}
