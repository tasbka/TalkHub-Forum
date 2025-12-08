export function ForumTopic({
  id,
  title,
  author,
  category,
  replies,
  views,
  likes,
  timestamp,
  isPinned,
  isSolved,
  avatar,
   onCommentsClick
}) {
   const handleCommentsClick = (e) => {
    e.stopPropagation(); // Останавливаем всплытие события
    if (onCommentsClick) {
      onCommentsClick({ 
        id, title, author, category, views, timestamp, 
        isPinned, isSolved, avatar, replies 
      });
    }
  };
  const handleTopicClick = () => {
  }
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border">
      <div className="flex items-start gap-3">
        <div className="text-2xl">{avatar}</div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {isPinned && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                📌 Закреплено
              </span>
            )}
            {isSolved && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                ✅ Решено
              </span>
            )}
            <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
              {category}
            </span>
          </div>
          
          <h3 className="text-lg font-medium text-foreground mb-2 hover:text-primary transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>👤 {author}</span>
              <span>🕒 {timestamp}</span>
            </div>
            <div className="flex items-center gap-4">
            <button 
                onClick={handleCommentsClick}
                className="flex items-center gap-1 hover:text-purple-700 transition-colors focus:outline-none"
                title="Перейти к комментариям"
              >
                <span className="text-lg">💬</span>
                <span>{replies}</span>
              </button>
              <span>👁️ {views}</span>
              <span>❤️ {likes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}