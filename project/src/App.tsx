import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LibraryProvider, useLibrary } from './contexts/LibraryContext';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import BookList from './components/Books/BookList';
import MyLoans from './components/Loans/MyLoans';
import ManageBooks from './components/Admin/ManageBooks';
import ManageUsers from './components/Admin/ManageUsers';
import Settings from './components/Admin/Settings';

const MainApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { addConnectionLog } = useLibrary();
  const [isLogin, setIsLogin] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');

  // Listen for connection log events
  useEffect(() => {
    const handleConnectionLog = (event: CustomEvent) => {
      addConnectionLog(event.detail);
    };

    window.addEventListener('addConnectionLog', handleConnectionLog as EventListener);
    
    return () => {
      window.removeEventListener('addConnectionLog', handleConnectionLog as EventListener);
    };
  }, [addConnectionLog]);

  if (!isAuthenticated) {
    return isLogin ? (
      <LoginForm onToggleForm={() => setIsLogin(false)} />
    ) : (
      <RegisterForm onToggleForm={() => setIsLogin(true)} />
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'books':
        return <BookList />;
      case 'my-loans':
        return <MyLoans />;
      case 'manage-books':
        return <ManageBooks />;
      case 'manage-users':
        return <ManageUsers />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <LibraryProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LibraryProvider>
  );
}

export default App;