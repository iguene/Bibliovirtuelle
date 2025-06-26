import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLibrary } from '../../contexts/LibraryContext';
import { Settings as SettingsIcon, Shield, Clock, BookOpen, Eye, Save, AlertTriangle } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { settings, updateSettings, connectionLogs } = useLibrary();
  
  const [activeTab, setActiveTab] = useState('loans');
  const [loanSettings, setLoanSettings] = useState({
    maxBooksPerUser: settings?.maxBooksPerUser || 5,
    defaultLoanDuration: settings?.defaultLoanDuration || 30,
    lateFeePerDay: settings?.lateFeePerDay || 0.50,
    maxLateDays: settings?.maxLateDays || 90
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSaveLoanSettings = () => {
    updateSettings(loanSettings);
    setMessage({ type: 'success', text: 'Paramètres de prêt sauvegardés avec succès !' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas.' });
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 8 caractères.' });
      return;
    }
    
    // Simulate password change
    setMessage({ type: 'success', text: 'Mot de passe modifié avec succès !' });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'login':
        return 'bg-green-100 text-green-800';
      case 'logout':
        return 'bg-blue-100 text-blue-800';
      case 'failed_login':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLogTypeText = (type: string) => {
    switch (type) {
      case 'login':
        return 'Connexion';
      case 'logout':
        return 'Déconnexion';
      case 'failed_login':
        return 'Échec connexion';
      default:
        return type;
    }
  };

  const tabs = [
    { id: 'loans', label: 'Configuration des prêts', icon: BookOpen },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'logs', label: 'Logs de connexion', icon: Eye }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <SettingsIcon className="h-6 w-6 text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-900">Paramètres système</h1>
      </div>

      {/* Message de notification */}
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' :
          'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Configuration des prêts */}
          {activeTab === 'loans' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration des prêts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre maximum de livres par utilisateur
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={loanSettings.maxBooksPerUser}
                      onChange={(e) => setLoanSettings({
                        ...loanSettings,
                        maxBooksPerUser: parseInt(e.target.value)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Limite le nombre de livres qu'un utilisateur peut emprunter simultanément
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durée de prêt par défaut (jours)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={loanSettings.defaultLoanDuration}
                      onChange={(e) => setLoanSettings({
                        ...loanSettings,
                        defaultLoanDuration: parseInt(e.target.value)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Durée standard d'un emprunt avant retour obligatoire
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pénalité par jour de retard (€)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.01"
                      value={loanSettings.lateFeePerDay}
                      onChange={(e) => setLoanSettings({
                        ...loanSettings,
                        lateFeePerDay: parseFloat(e.target.value)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Montant facturé par jour de retard
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre maximum de jours de retard
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={loanSettings.maxLateDays}
                      onChange={(e) => setLoanSettings({
                        ...loanSettings,
                        maxLateDays: parseInt(e.target.value)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Après ce délai, le livre est considéré comme perdu
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Aperçu des paramètres</h4>
                      <ul className="text-sm text-blue-700 mt-1 space-y-1">
                        <li>• Maximum {loanSettings.maxBooksPerUser} livre{loanSettings.maxBooksPerUser > 1 ? 's' : ''} par utilisateur</li>
                        <li>• Durée de prêt : {loanSettings.defaultLoanDuration} jour{loanSettings.defaultLoanDuration > 1 ? 's' : ''}</li>
                        <li>• Pénalité : {loanSettings.lateFeePerDay}€ par jour de retard</li>
                        <li>• Livre considéré perdu après {loanSettings.maxLateDays} jour{loanSettings.maxLateDays > 1 ? 's' : ''} de retard</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleSaveLoanSettings}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Sauvegarder les paramètres</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sécurité */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Changement de mot de passe</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mot de passe actuel
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value
                        })}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({
                          ...showPasswords,
                          current: !showPasswords.current
                        })}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <Eye className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value
                        })}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({
                          ...showPasswords,
                          new: !showPasswords.new
                        })}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <Eye className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 8 caractères
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmer le nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value
                        })}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({
                          ...showPasswords,
                          confirm: !showPasswords.confirm
                        })}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <Eye className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Changer le mot de passe
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Logs de connexion */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique des connexions</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Utilisateur
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date/Heure
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Adresse IP
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {connectionLogs.slice(0, 50).map((log, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {log.userEmail}
                              </div>
                              <div className="text-sm text-gray-500">
                                {log.userName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLogTypeColor(log.type)}`}>
                                {getLogTypeText(log.type)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(log.timestamp)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {log.ipAddress}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {connectionLogs.length === 0 && (
                  <div className="text-center py-8">
                    <Eye className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun log disponible</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Les connexions apparaîtront ici une fois enregistrées.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;