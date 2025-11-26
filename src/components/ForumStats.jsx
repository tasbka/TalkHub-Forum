export function ForumStats() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
      <h3 className="text-lg font-medium mb-4">Статистика форума</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Всего тем:</span>
          <span className="font-medium">156</span>
        </div>
        <div className="flex justify-between">
          <span>Сообщений:</span>
          <span className="font-medium">892</span>
        </div>
        <div className="flex justify-between">
          <span>Пользователей:</span>
          <span className="font-medium">234</span>
        </div>
      </div>
    </div>
  );
}