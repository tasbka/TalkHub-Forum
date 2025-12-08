// src/components/Comment.jsx
import { Reply } from 'lucide-react';

export function Comment({
  author,
  content,
  timestamp,
  avatar = '👤',
  isAuthor = false,
  onReply
}) {
  return (
    <div className="bg-white/80 rounded-xl p-5 border-2 border-purple-200 hover:shadow-md transition-all">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-300 via-pink-200 to-purple-400 flex items-center justify-center shadow-md ring-2 ring-white">
            <span>{avatar}</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-800 font-medium">{author}</span>
              {isAuthor && (
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                  Вы
                </span>
              )}
              <span className="text-xs text-gray-500">{timestamp}</span>
            </div>
          </div>

          <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">{content}</p>

          <div className="flex items-center gap-2">
            {onReply && (
              <button
                onClick={onReply}
                className="flex items-center text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Reply className="h-4 w-4 mr-1.5" />
                Ответить
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}