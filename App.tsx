
import React, { useState, useCallback } from 'react';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import DashboardPage from './components/DashboardPage';

type Page = 'login' | 'signup' | 'dashboard';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<Page>('login');

  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentPage('login');
  }, []);

  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const renderPage = () => {
    if (isAuthenticated) {
      return <DashboardPage onLogout={handleLogout} />;
    }
    switch (currentPage) {
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToSignUp={() => navigateTo('signup')} />;
      case 'signup':
        return <SignUpPage onSignUpSuccess={handleLoginSuccess} onNavigateToLogin={() => navigateTo('login')} />;
      default:
        return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToSignUp={() => navigateTo('signup')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      {renderPage()}
    </div>
  );
};

export default App;
