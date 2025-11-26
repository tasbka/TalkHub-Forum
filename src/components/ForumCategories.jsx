export function ForumCategories() {
  const categories = [
    { name: 'API Docs', count: 45, color: 'bg-purple-100 text-purple-800' },
    { name: 'Обсуждения', count: 23, color: 'bg-blue-100 text-blue-800' },
    { name: 'Вопросы', count: 67, color: 'bg-green-100 text-green-800' },
    { name: 'Идеи', count: 12, color: 'bg-yellow-100 text-yellow-800' },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
      <h3 className="text-lg font-medium mb-4">Категории</h3>
      <div className="space-y-2">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center justify-between p-2 hover:bg-secondary rounded cursor-pointer transition-colors">
            <span className={`text-xs px-2 py-1 rounded ${category.color}`}>
              {category.name}
            </span>
            <span className="text-sm text-muted-foreground">{category.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}