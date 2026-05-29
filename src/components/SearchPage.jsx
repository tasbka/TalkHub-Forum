// src/components/SearchPage.jsx
import { useState, useEffect } from 'react';
import { Search, User, MessageSquare, Eye, ThumbsUp, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Layout } from './Layout';
import simpleClient from '../api/simpleClient';
import noteService from '../services/noteService';

export function SearchPage({ onBack, currentUser, onLogout, onProfileClick, onContactsClick, onInstructionClick, onUserClick, onTopicClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ topics: [], users: [] });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('topics'); // 'topics' or 'users'

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      // Поиск тем
      const topics = await noteService.searchNotes(searchQuery);
      
      // Поиск пользователей
      const usersResponse = await simpleClient.get(`/users/search?q=${encodeURIComponent(searchQuery)}`);
      const users = usersResponse.success ? usersResponse.data : [];
      
      setSearchResults({ topics, users });
    } catch (error) {
      console.error('Ошибка поиска:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getSectionColor = (sec) => {
    switch(sec) {
      case 'C++': return 'from-blue-200 to-cyan-200 border-blue-300 text-blue-700';
      case 'C#': return 'from-purple-200 to-violet-200 border-purple-300 text-purple-700';
      case 'Web': return 'from-pink-200 to-rose-200 border-pink-300 text-pink-700';
      default: return 'from-purple-200 to-pink-200 border-purple-300 text-purple-700';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Недавно';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} ч назад`;
    return date.toLocaleDateString();
  };

  return (
    <Layout 
      currentUser={currentUser}
      onLogout={onLogout}
      onProfileClick={onProfileClick}
      onContactsClick={onContactsClick}
      onInstructionClick={onInstructionClick}
      onSearch={() => {}}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Кнопка назад */}
        <button
          onClick={onBack}
          className="flex items-center mb-6 px-4 py-2 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Вернуться
        </button>

        {/* Поисковая строка */}
        <div className="bg-white/80 rounded-2xl p-6 border-2 border-purple-200 shadow-lg mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
            <input
              type="text"
              placeholder="Поиск по заголовкам, содержимому тем или именам пользователей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-24 py-4 bg-white/60 border-2 border-purple-200 rounded-xl text-purple-900 placeholder:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50"
            >
              {loading ? 'Поиск...' : 'Найти'}
            </button>
          </div>
        </div>

        {/* Результаты поиска */}
        {searchQuery && (
          <>
            {/* Вкладки */}
            <div className="flex gap-2 mb-6 border-b-2 border-purple-200 pb-2">
              <button
                onClick={() => setActiveTab('topics')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'topics'
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md'
                    : 'text-purple-700 hover:bg-purple-100'
                }`}
              >
                Темы ({searchResults.topics.length})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'users'
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md'
                    : 'text-purple-700 hover:bg-purple-100'
                }`}
              >
                Пользователи ({searchResults.users.length})
              </button>
            </div>

            {/* Результаты поиска тем */}
            {activeTab === 'topics' && (
              <>
              {!searchResults.topics || searchResults.topics.length === 0 ? (
      <div className="bg-white/80 rounded-2xl p-12 text-center border-2 border-purple-200">
        <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">По вашему запросу ничего не найдено</p>
      </div>
    ) : (
                  <div className="space-y-4">
                    {searchResults.topics.map((topic) => (
                      <div
                        key={topic.id}
                        onClick={() => onTopicClick?.(topic)}
                        className="bg-white/80 rounded-xl p-5 border-2 border-purple-200 hover:shadow-xl hover:border-purple-400 hover:scale-[1.01] transition-all cursor-pointer"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-300 via-pink-200 to-purple-400 flex items-center justify-center shadow-md">
                              <span className="text-2xl">{topic.avatar || '👤'}</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                              {topic.title}
                            </h3>
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              {topic.section && (
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getSectionColor(topic.section)} shadow-sm`}>
                                  {topic.section}
                                </span>
                              )}
                              <span className="px-3 py-1 rounded-full text-xs bg-gradient-to-r from-purple-200 to-pink-200 text-purple-700 shadow-sm">
                                {topic.type === 'Вопросы' ? 'Вопрос' : 'Обсуждение'}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {topic.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                {topic.replies || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {topic.views || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                {topic.likes || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                        {topic.content && (
                          <div className="mt-3 pt-3 border-t border-purple-100">
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {topic.content}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Результаты поиска пользователей */}
            {activeTab === 'users' && (
              <>
                 {!searchResults.users || searchResults.users.length === 0 ? (
      <div className="bg-white/80 rounded-2xl p-12 text-center border-2 border-purple-200">
        <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Пользователи не найдены</p>
      </div>
    ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.users.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => onUserClick?.(user.id, user.username)}
                        className="bg-white/80 rounded-xl p-4 border-2 border-purple-200 hover:shadow-xl hover:border-purple-400 hover:scale-[1.01] transition-all cursor-pointer flex items-center gap-4"
                      >
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center shadow-md">
                          <User className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{user.username}</h3>
                          <p className="text-sm text-gray-500">Участник форума</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span>📝 {user.postCount || 0} тем</span>
                            <span>💬 {user.commentCount || 0} комментариев</span>
                          </div>
                        </div>
                        <Button className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-3 py-1 text-sm">
                          Перейти
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}