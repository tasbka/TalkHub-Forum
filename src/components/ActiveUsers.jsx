export function ActiveUsers() {
  const users = [
    { name: 'Александра К.', role: '👩‍💻 Модератор' },
    { name: 'Иван М.', role: '👨‍💼 Разработчик' },
    { name: 'Мария С.', role: '🧑‍💻 Админ' },
    { name: 'Дмитрий П.', role: '👨‍🔬 Пользователь' },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
      <h3 className="text-lg font-medium mb-4">Активные пользователи</h3>
      <div className="space-y-3">
        {users.map((user, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="font-medium text-sm">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}