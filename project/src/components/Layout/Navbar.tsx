import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, BookOpen } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">BiblioVirtuelle</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="flex items-center space-x-2">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.firstName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {user.firstName} {user.lastName}
                  </span>
                  {user.role === 'admin' && (
                    <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;