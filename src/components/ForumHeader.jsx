export function ForumHeader({ onLogout }) {
  return (
    <header className="bg-white shadow-sm border-b border-purple-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-700">TalkHub Forum</h1>
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-4">
              <button className="text-gray-700 hover:text-purple-700">Главная</button>
              <button className="text-gray-700 hover:text-purple-700">Темы</button>
              <button className="text-gray-700 hover:text-purple-700">Пользователи</button>
            </nav>
            {onLogout && (
              <button 
                onClick={onLogout}
                className="px-4 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              >
                Выйти
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}