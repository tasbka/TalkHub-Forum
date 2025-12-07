import React, { useState, useEffect } from 'react';
import statsService from '../services/statsService';
import { Users, MessageSquare, FileText, UserPlus } from 'lucide-react';

export function ForumStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTopics: 0,
    totalReplies: 0,
    todayTopics: 0,
    todayUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await statsService.getForumStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Статистика форума</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-primary mb-6">Статистика форума</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Всего тем</p>
              <p className="text-2xl font-bold">{stats.totalTopics}</p>
            </div>
          </div>
          {stats.todayTopics > 0 && (
            <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +{stats.todayTopics} сегодня
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <MessageSquare className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Сообщений</p>
              <p className="text-2xl font-bold">{stats.totalReplies}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Пользователей</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
          </div>
          {stats.todayUsers > 0 && (
            <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +{stats.todayUsers} сегодня
            </span>
          )}
        </div>
      </div>
    </div>
  );
}