import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  BookOpen, 
  Users, 
  PlusCircle, 
  BarChart3, 
  Settings,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const { user } = useAuth();

  const navigationItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'books', label: 'Livres', icon: BookOpen },
    { id: 'my-loans', label: 'Mes emprunts', icon: UserCheck },
  ];

  const adminItems = [
    { id: 'manage-books', label: 'Gérer les livres', icon: PlusCircle },
    { id: 'manage-users', label: 'Gérer les utilisateurs', icon: Users },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeView === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}

        {user?.role === 'admin' && (
          <>
            <div className="border-t border-gray-700 my-4 pt-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Administration
              </h3>
            </div>
            {adminItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeView === item.id
                      ? 'bg-orange-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;