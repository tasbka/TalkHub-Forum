import { useState, useEffect } from 'react';
import './styles/globals.css';
import { AuthPage } from './components/AuthPage';
import MainForum from './components/MainForum';
import { UserProfilePage } from './components/UserProfilePage';
import authService from './services/authService';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  // Загрузка пользователя с обновлением из БД
  useEffect(() => {
    const initUser = async () => {
        const user = authService.getCurrentUser();
        if (user && user.id) {
            try {
                const response = await fetch(`http://localhost:5234/api/users/${user.id}`);
                const result = await response.json();
                if (result.success && result.data) {
                    const updatedUser = { ...user, ...result.data };
                    setCurrentUser(updatedUser);
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                } else {
                    setCurrentUser(user);
                }
            } catch (error) {
                console.error('Ошибка загрузки пользователя:', error);
                setCurrentUser(user);
            }
        }
    };
    initUser();
  }, []);

  const handleAuthSuccess = async (userData) => {
    setShowAuth(false);
    
    // Получаем актуальные данные с сервера
    try {
        const response = await fetch(`http://localhost:5234/api/users/${userData.id}`);
        const result = await response.json();
        if (result.success && result.data) {
            const updatedUser = { ...userData, ...result.data };
            setCurrentUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } else {
            setCurrentUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        }
    } catch (error) {
        console.error('Ошибка:', error);
        setCurrentUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const handleShowAuth = () => {
    setShowAuth(true);
  };

  const handleCloseAuth = () => {
    setShowAuth(false);
  };

  const handleNavigateToHome = () => {
    setCurrentPage('home');
  };

  const handleNavigateToProfile = () => {
    if (currentUser) {
      setCurrentPage('profile');
    } else {
      handleShowAuth();
    }
  };

  const handleNavigateToContacts = () => {
    alert('Страница контактов в разработке');
  };

  const handleNavigateToInstruction = () => {
    alert('Страница инструкции в разработке');
  };

  const handleNavigateToAuth = () => {
    setCurrentPage('home');
    setShowAuth(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'profile':
        return (
          <UserProfilePage
            onBack={() => setCurrentPage('home')}
            onLogout={handleLogout}
            onNavigateToAuth={handleNavigateToAuth}
            onNavigateToHome={handleNavigateToHome}
            onNavigateToContacts={handleNavigateToContacts}
            onNavigateToInstruction={handleNavigateToInstruction}
          />
        );
      
      default:
        return (
          <MainForum 
            currentUser={currentUser}
            onLogout={handleLogout}
            onShowAuth={handleShowAuth}
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToContacts={handleNavigateToContacts}
            onNavigateToInstruction={handleNavigateToInstruction}
          />
        );
    }
  };

  return (
    <>
      {renderPage()}
      
      {showAuth && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-md w-full">
            <AuthPage 
              onAuthSuccess={handleAuthSuccess}
              onClose={handleCloseAuth}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default App;