// src/components/Layout.jsx
import { ForumHeader } from './ForumHeader';
import { Footer } from './Footer';  // Добавьте импорт

export function Layout({ 
    children, 
    currentUser, 
    onLogout, 
    onProfileClick, 
    onContactsClick, 
    onInstructionClick, 
    onSearch, 
    onNavigateToMessage,
    onShowAuth,
    onAdminPanelClick
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 flex flex-col">
      <ForumHeader 
        currentUser={currentUser}
        onLogout={onLogout}
        onProfileClick={onProfileClick}
        onContactsClick={onContactsClick}
        onInstructionClick={onInstructionClick}
        onSettingsClick={() => {}}
        onSearch={onSearch}
        onNavigateToMessage={onNavigateToMessage}
        onShowAuth={onShowAuth}
        onAdminPanelClick={onAdminPanelClick}
      />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />  {}
    </div>
  );
}