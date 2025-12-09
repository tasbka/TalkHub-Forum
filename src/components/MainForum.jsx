import '../styles/globals.css';
import { ForumHeader } from './ForumHeader';         
import { ForumCategories } from './ForumCategories';  
import { ForumTopic } from './ForumTopic';            
import { ForumStats } from './ForumStats';            
import { ActiveUsers } from './ActiveUsers';  
import { TopicDetailPage } from './TopicDetailPage';
import { CreateTopicPage } from './CreateTopicPage';
import { Button } from './ui/button';                 
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import noteService from '../services/noteService';


function MainForum({ onLogout, currentUser }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showTopicDetail, setShowTopicDetail] = useState(false);

   useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
     try {
    setLoading(true);
    const notes = await noteService.getAllNotes();
    
    console.log('Загруженные темы с сервера (сырые):', notes);
    
    // Проверяем, что notes существует и это массив
    if (notes && Array.isArray(notes)) {
      const formattedTopics = notes.map(note => {
        // Отладочная информация
        console.log('Обработка темы:', note);
        
        // Нормализуем данные - проверяем разные варианты имен полей
        const topic = {
          id: note.id || note.Id || note.NoteId,
          title: note.title || note.Title || 'Без названия',
          category: note.category || note.Category || note.categoryName || 'API Docs',
          author: note.author || note.Author || note.authorName || note.UserName || 'Аноним',
          replies: note.replies || note.Replies || note.commentCount || note.CommentCount || 0,
          views: note.views || note.Views || 0,
          likes: note.likes || note.Likes || 0,
          timestamp: formatTimestamp(note.timestamp || note.Timestamp || note.createdAt || note.CreatedAt),
          isPinned: note.isPinned || note.IsPinned || false,
          isSolved: note.isSolved || note.IsSolved || false,
          content: note.content || note.Content || '',
          avatar: getAvatar(note.author || note.Author || note.authorName || note.UserName)
        };
        
        return topic;
      });
      
      console.log('Все отформатированные темы:', formattedTopics);
      setTopics(formattedTopics);
    } else {
      console.warn('Нет тем или неверный формат ответа:', notes);
      // Покажем тестовые данные для отладки
      const testTopics = [
        {
          id: '1',
          title: 'Как правильно использовать REST API аутентификацию?',
          category: 'API Docs',
          author: 'Александра К.',
          replies: 3,
          views: 1250,
          likes: 42,
          timestamp: '2 часа назад',
          isPinned: true,
          isSolved: true,
          content: 'Обсуждение лучших практик для REST API аутентификации...',
          avatar: '👩‍💻'
        },
        {
          id: '2',
          title: 'Вопрос по Entity Framework Core',
          category: 'Базы данных',
          author: 'Иван М.',
          replies: 5,
          views: 890,
          likes: 28,
          timestamp: '5 часов назад',
          isPinned: false,
          isSolved: false,
          content: 'Помогите разобраться с миграциями...',
          avatar: '👨‍💻'
        }
      ];
      console.log('Используем тестовые темы:', testTopics);
      setTopics(testTopics);
    }
  } catch (error) {
    console.error('Ошибка загрузки тем:', error);
    setTopics([]);
  } finally {
    setLoading(false);
  }
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Недавно';
  
  // Если это строка ISO формата
  if (typeof timestamp === 'string' && timestamp.includes('T')) {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'только что';
      if (diffMins < 60) return `${diffMins} минут назад`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)} часов назад`;
      return date.toLocaleDateString();
    } catch (e) {
      return timestamp;
    }
  }
  
  return timestamp;
};

  const getAvatar = (username) => {
    const avatars = ['👩‍💻', '👨‍💻', '👤', '🎓', '💻'];
    if (!username) return '👤';
    const index = username.length % avatars.length;
    return avatars[index];
  };

  const handleCreateTopic = async (newTopicData) => {
    try {
      console.log('Создание темы:', newTopicData);
      const topicWithAuthor = {
        ...newTopicData,
        authorId: currentUser?.id,
        author: currentUser?.username
      };
      
      await noteService.createNote(topicWithAuthor);
      
      await loadTopics();
      
      setShowCreateTopic(false);
      
    } catch (error) {
      console.error('Ошибка создания темы:', error);
      alert('Не удалось создать тему: ' + (error.message || error));
    }
  };

  //  клик по всей теме
  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setShowTopicDetail(true);
  };
  
  const handleCommentsClick = (topic) => {
    setSelectedTopic(topic);
    setShowTopicDetail(true);
  };

const handleAddComment = async (comment) => {
  if (selectedTopic) {
    // счетчик комментариев у темы
    const updatedTopics = topics.map(t => 
      t.id === selectedTopic.id 
        ? { ...t, replies: t.replies + 1 }
        : t
    );
    setTopics(updatedTopics);
    
    // Обновить тему
    setSelectedTopic({
      ...selectedTopic,
      replies: selectedTopic.replies + 1
    });
  }
};

// TopicDetailPage
if (showTopicDetail && selectedTopic) {
  return (
    <TopicDetailPage
      topic={selectedTopic}
      onBack={() => setShowTopicDetail(false)}
      onAddComment={handleAddComment}
      onLogout={onLogout} 
      currentUser={currentUser}
    />
  );
}
  if (showTopicDetail && selectedTopic) {
    return (
      <TopicDetailPage
        topic={selectedTopic}
        onBack={() => setShowTopicDetail(false)}
        onAddComment={handleAddComment}
      />
    );
  }

  if (showCreateTopic) {
    return (
      <CreateTopicPage
        onBack={() => setShowCreateTopic(false)}
        onSubmit={handleCreateTopic}
         currentUser={currentUser}
      />
    );
  }

  return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <ForumHeader onLogout={onLogout} currentUser={currentUser} /> {/* Передаем currentUser */}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Sidebar Left */}
          <aside className="lg:col-span-3 space-y-6">
            <ForumCategories />
          </aside>
          
          {/* Main Content */}
          <div className="lg:col-span-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-primary">Последние темы</h2>
                <p className="text-muted-foreground">Обсуждение web API и разработки</p>
              </div>
              <Button className="bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 hover:from-purple-400 hover:via-pink-400 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all"
               onClick={() => setShowCreateTopic(true)}>

                <Plus className="h-5 w-5 mr-2" strokeWidth={2.5} />
                Создать тему
              </Button>
            </div>
            
            <div className="space-y-4">
            {topics.map((topic) => (
                <div 
                  key={topic.id} 
                  onClick={() => handleTopicClick(topic)}
                  className="cursor-pointer hover:scale-[1.01] transition-transform"
                >
                  <ForumTopic 
                    {...topic}
                    onCommentsClick={handleCommentsClick} // обработчик
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Sidebar Right */}
          <aside className="lg:col-span-3 space-y-6">
            <ForumStats />
            <ActiveUsers />
          </aside>
        </div>
      </main>
    </div>
  );
}

export default MainForum;