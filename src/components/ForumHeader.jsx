export function ForumHeader() {
  return (
    <header className="bg-white shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">TalkHub Forum</h1>
          <nav className="flex items-center gap-4">
            <a href="#" className="text-foreground hover:text-primary transition-colors">Главная</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">Темы</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">Пользователи</a>
          </nav>
        </div>
      </div>
    </header>
  );
}