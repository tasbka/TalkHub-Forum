import '../styles/globals.css';
import { ForumHeader } from './ForumHeader';         
import { ForumCategories } from './ForumCategories';  
import { ForumTopic } from './ForumTopic';            
import { ForumStats } from './ForumStats';            
import { ActiveUsers } from './ActiveUsers';  
import { CreateTopicPage } from './CreateTopicPage';
import { Button } from './ui/button';                 
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import noteService from '../services/noteService';


function MainForum({ onLogout }) {

    const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTopic, setShowCreateTopic] = useState(false); // Состояние для страницы создания

   useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      setLoading(true);
      const notes = await noteService.getAllNotes();
      
      console.log('Загруженные темы:', notes);
      
      // Преобразуем в нужный формат
      const formattedTopics = notes.map(note => ({
        id: note.id,
        title: note.title,
        category: note.category,
        author: note.author,
        replies: note.replies || 0,
        views: note.views || 0,
        likes: note.likes || 0,
        timestamp: note.timestamp,
        isPinned: note.isPinned,
        isSolved: note.isSolved,
        avatar: getAvatar(note.author)
      }));
      
      setTopics(formattedTopics);
    } catch (error) {
      console.error('Ошибка загрузки тем:', error);
    } finally {
      setLoading(false);
    }
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
      await noteService.createNote(newTopicData);
      
      // Перезагружаем список
      await loadTopics();
      
      // Возвращаемся на главную
      setShowCreateTopic(false);
      
    } catch (error) {
      console.error('Ошибка создания темы:', error);
      alert('Не удалось создать тему: ' + (error.message || error));
    }
  };

  if (showCreateTopic) {
    return (
      <CreateTopicPage
        onBack={() => setShowCreateTopic(false)}
        onSubmit={handleCreateTopic}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <ForumHeader onLogout={onLogout} />
      
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
                <ForumTopic key={topic.id} {...topic} />
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