import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import { BookOpen, Eye, EyeOff, AlertCircle, Wifi, WifiOff } from 'lucide-react';

interface LoginFormProps {
  onToggleForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const { login } = useAuth();

  useEffect(() => {
    const checkBackend = async () => {
      setBackendStatus('checking');
      try {
        const isConnected = await apiService.testConnection();
        setBackendStatus(isConnected ? 'connected' : 'disconnected');
      } catch (error) {
        console.error('Backend connection test failed:', error);
        setBackendStatus('disconnected');
      }
    };
    
    checkBackend();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Email ou mot de passe incorrect');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (backendStatus) {
      case 'checking':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>;
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-600" />;
      case 'disconnected':
        return <WifiOff className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusText = () => {
    switch (backendStatus) {
      case 'checking':
        return 'Vérification du serveur...';
      case 'connected':
        return 'Mode démonstration actif';
      case 'disconnected':
        return 'Serveur déconnecté';
    }
  };

  const getStatusColor = () => {
    switch (backendStatus) {
      case 'checking':
        return 'text-gray-600';
      case 'connected':
        return 'text-green-600';
      case 'disconnected':
        return 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <BookOpen className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Connexion
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Accédez à votre bibliothèque virtuelle
          </p>
          
          {/* Backend Status */}
          <div className={`mt-4 flex items-center justify-center space-x-2 text-sm ${getStatusColor()}`}>
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {backendStatus === 'connected' && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md text-sm">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Mode démonstration</p>
                    <p className="mt-1">L'application fonctionne avec des données simulées.</p>
                    <div className="mt-2">
                      <strong>Comptes de démonstration :</strong><br />
                      Admin: admin@library.com / password<br />
                      Utilisateur: john.doe@email.com / password
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="votre@email.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Mot de passe"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Connexion...</span>
                  </div>
                ) : (
                  'Se connecter'
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={onToggleForm}
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                disabled={isLoading}
              >
                Pas encore de compte ? S'inscrire
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;