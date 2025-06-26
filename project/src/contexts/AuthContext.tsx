import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../types';
import { apiService } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const userData = await apiService.getProfile();
          setUser({
            id: userData.id.toString(),
            email: userData.email,
            firstName: userData.first_name,
            lastName: userData.last_name,
            role: userData.role,
            joinDate: userData.join_date,
            avatar: userData.avatar,
            isActive: true
          });
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to get user profile:', error);
          localStorage.removeItem('auth_token');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email);
      const response = await apiService.login(email, password);
      console.log('Login response:', response);
      
      const userData = response.user;
      
      const user: User = {
        id: userData.id.toString(),
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        role: userData.role,
        joinDate: userData.join_date,
        avatar: userData.avatar,
        isActive: true
      };
      
      setUser(user);
      setIsAuthenticated(true);
      
      // Log successful login
      window.dispatchEvent(new CustomEvent('addConnectionLog', {
        detail: {
          userId: user.id,
          userEmail: user.email,
          userName: `${user.firstName} ${user.lastName}`,
          type: 'login',
          timestamp: new Date().toISOString(),
          ipAddress: '127.0.0.1' // In a real app, this would come from the server
        }
      }));
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      
      // Log failed login attempt
      window.dispatchEvent(new CustomEvent('addConnectionLog', {
        detail: {
          userId: '',
          userEmail: email,
          userName: 'Unknown',
          type: 'failed_login',
          timestamp: new Date().toISOString(),
          ipAddress: '127.0.0.1'
        }
      }));
      
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id' | 'joinDate'> & { password: string }): Promise<boolean> => {
    try {
      console.log('Attempting registration for:', userData.email);
      const registerData = {
        email: userData.email,
        username: userData.email, // Use email as username
        first_name: userData.firstName,
        last_name: userData.lastName,
        password: userData.password,
        password_confirm: userData.password
      };
      
      const response = await apiService.register(registerData);
      console.log('Registration response:', response);
      
      const newUserData = response.user;
      
      const user: User = {
        id: newUserData.id.toString(),
        email: newUserData.email,
        firstName: newUserData.first_name,
        lastName: newUserData.last_name,
        role: newUserData.role,
        joinDate: newUserData.join_date,
        avatar: newUserData.avatar,
        isActive: true
      };
      
      setUser(user);
      setIsAuthenticated(true);
      
      // Log successful registration/login
      window.dispatchEvent(new CustomEvent('addConnectionLog', {
        detail: {
          userId: user.id,
          userEmail: user.email,
          userName: `${user.firstName} ${user.lastName}`,
          type: 'login',
          timestamp: new Date().toISOString(),
          ipAddress: '127.0.0.1'
        }
      }));
      
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = async () => {
    const currentUser = user;
    
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Log logout
    if (currentUser) {
      window.dispatchEvent(new CustomEvent('addConnectionLog', {
        detail: {
          userId: currentUser.id,
          userEmail: currentUser.email,
          userName: `${currentUser.firstName} ${currentUser.lastName}`,
          type: 'logout',
          timestamp: new Date().toISOString(),
          ipAddress: '127.0.0.1'
        }
      }));
    }
    
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};