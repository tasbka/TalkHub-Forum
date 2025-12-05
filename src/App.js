
import { useState } from 'react';
import './styles/globals.css';
import { AuthPage } from './components/AuthPage';
import { ForumCategories } from './components/ForumCategories';
import MainForum from './components/MainForum';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <>
      {isAuthenticated ? (
        <MainForum onLogout={handleLogout} />
      ) : (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      )}
    </>
  );
}

export default App;