import '../styles/globals.css';
import { ForumHeader } from './ForumHeader';         
import { ForumCategories } from './ForumCategories';  
import { ForumTopic } from './ForumTopic';            
import { ForumStats } from './ForumStats';            
import { ActiveUsers } from './ActiveUsers';  
import { CreateTopicPage } from './CreateTopicPage';
import { Button } from './ui/button';                 
import { Plus } from 'lucide-react';
import { useState } from 'react';



const initialTopics = [
  {
    id: 1,
    title: 'Как правильно использовать REST API аутентификацию?',
    author: 'Александра К.',
    category: 'API Docs',
    replies: 24,
    views: 1250,
    likes: 48,
    timestamp: '2 часа назад',
    isPinned: true,
    isSolved: true,
    avatar: '👩‍💻',
  },
];

function MainForum({ onLogout }) {

   const [topics, setTopics] = useState(initialTopics);
  const [showCreateTopic, setShowCreateTopic] = useState(false); // Состояние для страницы создания

  const handleCreateTopic = (newTopic) => {
    const topic = {
      id: topics.length + 1,
      ...newTopic,
      author: 'Вы', 
      replies: 0,
      views: 0,
      likes: 0,
      timestamp: 'только что',
      isPinned: false,
      isSolved: false,
      avatar: '👤',
    };
    
    setTopics([topic, ...topics]); // тему в начало
    setShowCreateTopic(false); // на главную
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