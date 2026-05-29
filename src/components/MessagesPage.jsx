// src/components/MessagesPage.jsx
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Layout } from './Layout';
import simpleClient from '../api/simpleClient';

export function MessagesPage({ 
    onBack, 
    recipientId, 
    recipientName, 
    recipientAvatar, 
    currentUser,
    onLogout,
    onProfileClick,
    onContactsClick,
    onInstructionClick,
    onSearch,
    onShowAuth,
    onAdminPanelClick
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const intervalRef = useRef(null);

  // Обработчики для навигации через хедер
  const handleProfileClickNav = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      window.location.href = '/profile';
    }
  };

  const handleContactsClickNav = () => {
    if (onContactsClick) {
      onContactsClick();
    } else {
      window.location.href = '/contacts';
    }
  };

  const handleInstructionClickNav = () => {
    if (onInstructionClick) {
      onInstructionClick();
    } else {
      window.location.href = '/instruction';
    }
  };

  // Обработчик кнопки "Назад"
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.href = '/';
    }
  };

  // Проверка авторизации
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadMessages();
      
      intervalRef.current = setInterval(loadMessages, 5000);
      
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [recipientId, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!currentUser) return;
    
    try {
      const response = await simpleClient.get(`/messages/conversation/${recipientId}`);
      if (response.success) {
        setMessages(response.data || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentUser) {
      if (onShowAuth) onShowAuth();
      return;
    }
    
    if (!newMessage.trim() || sending) return;
    
    setSending(true);
    try {
      const response = await simpleClient.post('/messages/send', {
        recipientId: recipientId,
        content: newMessage.trim()
      });
      
      if (response.success) {
        setNewMessage('');
        await loadMessages();
      }
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      alert('Не удалось отправить сообщение');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Если не авторизован - показываем сообщение
  if (!currentUser) {
    return (
      <Layout 
        currentUser={null}
        onLogout={onLogout}
        onProfileClick={handleProfileClickNav}
        onContactsClick={handleContactsClickNav}
        onInstructionClick={handleInstructionClickNav}
        onSearch={onSearch}
        onShowAuth={onShowAuth}
        onAdminPanelClick={onAdminPanelClick}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={handleBack}
            className="group flex items-center gap-2 mb-6 px-4 py-2 text-purple-600 hover:text-purple-700 rounded-xl transition-all duration-200 hover:bg-purple-50"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Назад</span>
          </button>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 text-center border-2 border-dashed border-purple-200">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <span className="text-3xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Только для авторизованных
            </h3>
            <p className="text-gray-500 mb-4">
              Чтобы отправлять сообщения, необходимо войти в аккаунт
            </p>
            <button
              onClick={() => onShowAuth?.()}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              Войти в аккаунт
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout 
        currentUser={currentUser}
        onLogout={onLogout}
        onProfileClick={handleProfileClickNav}
        onContactsClick={handleContactsClickNav}
        onInstructionClick={handleInstructionClickNav}
        onSearch={onSearch}
        onShowAuth={onShowAuth}
        onAdminPanelClick={onAdminPanelClick}
      >
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-purple-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-500">Загрузка сообщений...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      currentUser={currentUser}
      onLogout={onLogout}
      onProfileClick={handleProfileClickNav}
      onContactsClick={handleContactsClickNav}
      onInstructionClick={handleInstructionClickNav}
      onSearch={onSearch}
      onShowAuth={onShowAuth}
      onAdminPanelClick={onAdminPanelClick}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={handleBack}
          className="group flex items-center gap-2 mb-4 px-4 py-2 text-purple-600 hover:text-purple-700 rounded-xl transition-all duration-200 hover:bg-purple-50"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Назад</span>
        </button>
        
        {/* Информация о собеседнике */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 mb-4 border-2 border-purple-200 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
              <span className="text-2xl">{recipientAvatar || '👤'}</span>
            </div>
            <div>
              <h2 className="text-purple-800 font-semibold text-lg">{recipientName}</h2>
              <p className="text-xs text-gray-500">Переписка</p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-purple-200 shadow-lg overflow-hidden">
          <div className="h-[400px] overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <Send className="h-8 w-8 text-purple-400" />
                  </div>
                  <p className="text-gray-500">Напишите первое сообщение</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center shadow-md">
                      <span className="text-sm">{message.isOwn ? '👤' : (recipientAvatar || '👤')}</span>
                    </div>
                  </div>
                  <div className={`flex flex-col max-w-[70%] ${message.isOwn ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`rounded-2xl px-4 py-2 shadow-md ${
                        message.isOwn
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-tr-sm'
                          : 'bg-white text-gray-800 rounded-tl-sm border border-purple-200'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 px-2">
                      {message.formattedTime}
                    </span>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t-2 border-purple-200 p-4 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Напишите сообщение..."
                  rows={1}
                  className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-2xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none"
                  style={{ maxHeight: '120px', minHeight: '48px' }}
                  disabled={sending}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sending}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all mb-2 disabled:opacity-50 rounded-xl"
                size="icon"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}