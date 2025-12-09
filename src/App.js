
import { useState } from 'react';
import './styles/globals.css';
import { AuthPage } from './components/AuthPage';
import MainForum from './components/MainForum';
import authService from './services/authService';

function App() {
  const initialUser = authService.getCurrentUser();
  const [isAuthenticated, setIsAuthenticated] = useState(!!initialUser);
  const [currentUser, setCurrentUser] = useState(initialUser);

const handleAuthSuccess = () => {
    const user = authService.getCurrentUser();
    console.log('Пользователь после входа:', user);
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <>
      {isAuthenticated ? (
        <MainForum 
          onLogout={handleLogout} 
          currentUser={currentUser}
        />
      ) : (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      )}
    </>
  );
}

export default App;