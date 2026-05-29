import { useState, useEffect } from 'react';
import { X, MessageCircle, ThumbsUp, Award, Bell, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";

export function NotificationsPanel({ isOpen, onClose, onUnreadCountChange, onNavigateToTopic, onNavigateToMessage }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user?.id) {
        console.error('User ID not found');
        return;
      }
      
      const response = await fetch('http://localhost:5234/api/notifications', {
        headers: { 'X-User-Id': user.id }
      });
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.data || []);
        setUnreadCount(data.unreadCount || 0);
        if (onUnreadCountChange) {
          onUnreadCountChange(data.unreadCount || 0);
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки уведомлений:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      await fetch(`http://localhost:5234/api/notifications/${id}/read`, {
        method: 'POST',
        headers: { 'X-User-Id': user?.id || '' }
      });
      
      const updatedNotifications = notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      );
      setNotifications(updatedNotifications);
      
      const newUnreadCount = updatedNotifications.filter(n => !n.isRead).length;
      setUnreadCount(newUnreadCount);
      if (onUnreadCountChange) {
        onUnreadCountChange(newUnreadCount);
      }
    } catch (error) {
      console.error('Ошибка отметки уведомления:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      await fetch('http://localhost:5234/api/notifications/read-all', {
        method: 'POST',
        headers: { 'X-User-Id': user?.id || '' }
      });
      
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      if (onUnreadCountChange) {
        onUnreadCountChange(0);
      }
    } catch (error) {
      console.error('Ошибка отметки всех уведомлений:', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "Comment": return <MessageCircle className="h-5 w-5 text-purple-500" />;
      case "Like": return <ThumbsUp className="h-5 w-5 text-pink-500" />;
      case "Achievement": return <Award className="h-5 w-5 text-yellow-500" />;
      default: return <Bell className="h-5 w-5 text-purple-400" />;
    }
  };

  const handleNotificationClick = (notification) => {
  if (!notification.isRead) {
    markAsRead(notification.id);
  }
  
  if (notification.type === 'Comment' && notification.sourceId) {
    window.location.href = `/topic/${notification.sourceId}`;
    onClose();
  } 
  else if (notification.type === 'Like' && notification.sourceId) {
    window.location.href = `/topic/${notification.sourceId}`;
    onClose();
  }
  else if (notification.type === 'Message' && notification.sourceId) {
    if (onNavigateToMessage) {
      onNavigateToMessage(notification.sourceId);
    } else {
      localStorage.setItem('openChatWith', notification.sourceId);
      window.location.reload();
    }
    onClose();
  }
  else if (notification.sourceId) {
    window.location.href = `/topic/${notification.sourceId}`;
    onClose();
  }
};

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="fixed top-20 right-4 z-50 w-96 max-h-[600px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-purple-200/50 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 border-b-2 border-purple-200/50">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-purple-800 flex items-center gap-2">
              Уведомления
              {unreadCount > 0 && (
                <span className="text-sm bg-pink-400 text-white px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/50 text-purple-700">
              <X className="h-5 w-5" />
            </Button>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-purple-600 hover:bg-white/50 text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              Отметить все как прочитанные
            </Button>
          )}
        </div>

        <div className="overflow-y-auto max-h-[500px]">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-purple-400 text-sm mt-2">Загрузка...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-purple-400" />
              </div>
              <p className="text-purple-600 font-medium">Нет уведомлений</p>
              <p className="text-purple-400 text-sm mt-1">Здесь появятся ваши новые уведомления</p>
            </div>
          ) : (
            <div className="divide-y divide-purple-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-purple-50/50 transition-colors cursor-pointer ${
                    !notification.isRead ? "bg-purple-50/30" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        {getIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-purple-800">{notification.title}</p>
                      <p className="text-sm text-purple-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-purple-400 mt-1">{notification.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}