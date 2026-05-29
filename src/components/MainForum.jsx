// src/components/MainForum.jsx
import '../styles/globals.css';
import { Footer } from './Footer';
import simpleClient from '../api/simpleClient';
import { Users, Shield } from 'lucide-react';
import { UserProfileViewPage } from './UserProfileViewPage';
import { MessagesPage } from './MessagesPage';
import { InstructionPage } from './InstructionPage';
import { EditTopicPage } from './EditTopicPage';
import { ForumHeader } from './ForumHeader';         
import { ForumCategories } from './ForumCategories'; 
import { AdminUsersPage } from './AdminUsersPage'; 
import { ForumTopic } from './ForumTopic';            
import { ForumStats } from './ForumStats';           
 
import { ActiveUsers } from './ActiveUsers';  
import { TopicDetailPage } from './TopicDetailPage';
import { CreateTopicPage } from './CreateTopicPage';
import { Button } from './ui/button';                 
import { Plus, CheckCircle, X, MessageSquare, Search } from 'lucide-react';
import noteService from '../services/noteService';
import { UserProfilePage } from './UserProfilePage';
import { useState, useEffect, useCallback, useRef} from 'react';
import { ContactPage } from './ContactPage';
import { SearchResultsPage } from './SearchResultsPage';

function MainForum({ onLogout, currentUser: propCurrentUser, onShowAuth }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showTopicDetail, setShowTopicDetail] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [showInstruction, setShowInstruction] = useState(false);
  const [filter, setFilter] = useState({ section: null, category: null });
  const [localCurrentUser, setLocalCurrentUser] = useState(propCurrentUser);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState({ topics: [], users: [] });
  const [searchMode, setSearchMode] = useState('topics');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [showEditTopic, setShowEditTopic] = useState(false);
  const [showUserProfileView, setShowUserProfileView] = useState(false);
  const [viewProfileUserId, setViewProfileUserId] = useState(null);
  const [showMessages, setShowMessages] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
const [previousPage, setPreviousPage] = useState(null);

  const statsRef = useRef(null);
  const categoriesRef = useRef(null);
  const activeUsersRef = useRef(null);
  const hidingInProgress = useRef(null);
  const restoringInProgress = useRef(null);
  const deletingInProgress = useRef(null);

  const isAdmin = localCurrentUser?.role === 'Admin' || localCurrentUser?.role === 'Администратор';

  // Функции
  const loadTopics = useCallback(async () => {
    try {
      setLoading(true);
      const notes = await noteService.getAllNotes();

      const isAdmin = localCurrentUser?.role === 'Admin' || localCurrentUser?.role === 'Администратор';
      

      let visibleNotes = notes.filter(note => {

        const isHidden = note.isHidden === true || 
                         note.status === 'Hidden' || 
                         note.status === 2;
        
        if (isHidden) {
          return isAdmin || note.authorId === localCurrentUser?.id;
        }
        return true; 
      });
    
      let filteredNotes = visibleNotes;
      if (filter.section && filter.category) {
        filteredNotes = visibleNotes.filter(note => 
          note.section === filter.section && note.category === filter.category
        );
      } else if (filter.section) {
        filteredNotes = visibleNotes.filter(note => note.section === filter.section);
      }
      
      const sortedNotes = [...filteredNotes].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      
      const total = sortedNotes.length;
      const pages = Math.ceil(total / itemsPerPage);
      setTotalPages(pages);
      
      if (currentPage > pages && pages > 0) {
        setCurrentPage(1);
      }
      
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedNotes = sortedNotes.slice(startIndex, startIndex + itemsPerPage);
      
      setTopics(paginatedNotes);
    } catch (error) {
      console.error('Ошибка загрузки тем:', error);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  }, [filter, currentPage, itemsPerPage, localCurrentUser]);

  const refreshAllStats = useCallback(() => {
    if (statsRef.current) {
      statsRef.current.loadStats();
    }
    if (categoriesRef.current) {
      categoriesRef.current.loadSections();
    }
    if (activeUsersRef.current) {
      activeUsersRef.current.loadActiveUsers();
    }
  }, []);

const handleNavigateToInstruction = () => {
    // Запоминаем текущую страницу
    if (showCreateTopic) {
        setPreviousPage('create-topic');
    } else if (showUserProfile) {
        setPreviousPage('profile');
    } else if (showContacts) {
        setPreviousPage('contacts');
    } else if (showAdminPanel) {
        setPreviousPage('admin');
    } else {
        setPreviousPage('home');
    }
    setShowInstruction(true);
};

const handleNavigateToContacts = () => {
    if (showCreateTopic) {
        setPreviousPage('create-topic');
    } else if (showUserProfile) {
        setPreviousPage('profile');
    } else if (showInstruction) {
        setPreviousPage('instruction');
    } else if (showAdminPanel) {
        setPreviousPage('admin');
    } else {
        setPreviousPage('home');
    }
    setShowContacts(true);
};

const handleNavigateToProfile = () => {
    if (showCreateTopic) {
        setPreviousPage('create-topic');
    } else if (showContacts) {
        setPreviousPage('contacts');
    } else if (showInstruction) {
        setPreviousPage('instruction');
    } else if (showAdminPanel) {
        setPreviousPage('admin');
    } else {
        setPreviousPage('home');
    }
    setShowUserProfile(true);
};

  const handleLocalSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setIsSearching(false);
      await loadTopics();
      return;
    }
    
    setIsSearching(true);
    try {
      const topics = await noteService.searchNotes(query);
      const usersResponse = await simpleClient.get(`/users/search?q=${encodeURIComponent(query)}`);
      const users = usersResponse.success ? usersResponse.data : [];
      setSearchResults({ topics, users });
    } catch (error) {
      console.error('Ошибка поиска:', error);
    }
  }, [loadTopics]);

  // ЭФФЕКТЫ
  useEffect(() => {
    setLocalCurrentUser(propCurrentUser);
  }, [propCurrentUser]);

  useEffect(() => {
    loadTopics();
  }, [loadTopics]);

  useEffect(() => {
    if (!showTopicDetail && !showCreateTopic && !showUserProfile && !showSearchResults && !showAdminPanel) {
      loadTopics();
    }
  }, [showTopicDetail, showCreateTopic, showUserProfile, showSearchResults, showAdminPanel, loadTopics]);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery !== undefined) {
        handleLocalSearch(searchQuery);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, handleLocalSearch]);

  // Обработчики
  const handleSendMessage = (recipientId, recipientName, recipientAvatar) => {
    setMessageRecipient({ id: recipientId, name: recipientName, avatar: recipientAvatar });
    setShowMessages(true);
  };

  const handleNavigateToMessage = (userId) => {
    const loadUserForChat = async () => {
      try {
        const response = await fetch(`http://localhost:5234/api/users/${userId}`);
        const result = await response.json();
        if (result.success) {
          setMessageRecipient({
            id: result.data.id,
            name: result.data.username,
            avatar: result.data.avatar || '👤'
          });
          setShowMessages(true);
        }
      } catch (error) {
        console.error('Ошибка загрузки пользователя для чата:', error);
      }
    };
    loadUserForChat();
  };

  const handleActiveUserClick = (userId, username) => {
    if (localCurrentUser?.id === userId) {
      setShowUserProfile(true);
    } else {
      setViewProfileUserId(userId);
      setShowUserProfileView(true);
    }
  };

  const updateUserPostCount = (delta) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      user.postCount = Math.max(0, (user.postCount || 0) + delta);
      localStorage.setItem('user', JSON.stringify(user));
      setLocalCurrentUser(prev => prev ? { ...prev, postCount: user.postCount } : prev);
    }
  };

  const handleAuthorClick = (authorName, authorId) => {
    if (localCurrentUser?.id === authorId) {
      setShowUserProfile(true);
    } else {
      setViewProfileUserId(authorId);
      setShowUserProfileView(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    loadTopics();
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Moderator': return 'bg-purple-100 text-purple-800';
      case 'Developer': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role) => {
    const roles = {
      'Novice': 'Новичок',
      'Explorer': 'Исследователь',
      'Enthusiast': 'Энтузиаст',
      'Expert': 'Эксперт',
      'Master': 'Мастер',
      'GrandMaster': 'Гроссмейстер',
      'Guru': 'Гуру',
      'Sage': 'Мудрец',
      'Legend': 'Легенда',
      'Mythic': 'Мифический',
      'Developer': 'Разработчик',
      'Moderator': 'Модератор',
      'Admin': 'Администратор'
    };
    return roles[role] || role;
  };

  const handleUserClickFromSearch = (userId, username) => {
    if (localCurrentUser?.id === userId) {
      setShowUserProfile(true);
    } else {
      setViewProfileUserId(userId);
      setShowUserProfileView(true);
    }
    setSearchQuery('');
    setIsSearching(false);
  };

  const handleHideTopic = async (topicId) => {
    if (hidingInProgress.current === topicId) return;
    hidingInProgress.current = topicId;
    
    try {
      const response = await noteService.hideNote(topicId);
      if (response.success) {
        await loadTopics();
        refreshAllStats();
        setNotification({ show: true, message: 'Тема скрыта', type: 'success' });
      }
    } catch (error) {
      console.error('Ошибка скрытия темы:', error);
      setNotification({ show: true, message: 'Не удалось скрыть тему', type: 'error' });
    } finally {
      hidingInProgress.current = null;
    }
  };

  const handleRestoreTopic = async (topicId) => {
    if (restoringInProgress.current === topicId) return;
    restoringInProgress.current = topicId;
    
    try {
      const response = await noteService.restoreNote(topicId);
      if (response.success) {
        await loadTopics();
        refreshAllStats();
        setNotification({ show: true, message: 'Тема восстановлена', type: 'success' });
      }
    } catch (error) {
      console.error('Ошибка восстановления темы:', error);
      setNotification({ show: true, message: 'Не удалось восстановить тему', type: 'error' });
    } finally {
      restoringInProgress.current = null;
    }
  };

  const handleSearch = useCallback(async (query) => {
    try {
      setSearchLoading(true);
      setSearchTerm(query);
      const results = await noteService.searchNotes(query);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Ошибка поиска:', error);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleTopicClick = (topic) => {
   if (showUserProfile) {
        setPreviousPage('profile');
    } else if (showContacts) {
        setPreviousPage('contacts');
    } else if (showInstruction) {
        setPreviousPage('instruction');
    } else if (showAdminPanel) {
        setPreviousPage('admin');
    } else if (showCreateTopic) {
        setPreviousPage('create-topic');
    } else {
        setPreviousPage('home');
    }
    setSelectedTopic(topic);
    setShowTopicDetail(true);
  };

  const handleAdminPanelClick = () => {
    setShowAdminPanel(true);
  };

  const handleDeleteTopic = async (topicId) => {
    if (deletingInProgress.current === topicId) return;
    deletingInProgress.current = topicId;
    
    try {
      const response = await noteService.deleteNote(topicId);
      if (response && response.success === true) {
        await loadTopics();
        updateUserPostCount(-1);
        refreshAllStats();
        setNotification({ show: true, message: 'Тема успешно удалена', type: 'success' });
      }
    } catch (error) {
      console.error('Delete error:', error);
      setNotification({ show: true, message: 'Не удалось удалить тему', type: 'error' });
      await loadTopics();
    } finally {
      deletingInProgress.current = null;
    }
  };

  const handleTogglePin = async (topicId, isPinned) => {
    try {
      const response = await noteService.togglePinNote(topicId, isPinned);
      if (response.success) {
        setTopics(prevTopics => {
          const updatedTopics = prevTopics.map(topic =>
            topic.id === topicId ? { ...topic, isPinned: !topic.isPinned } : topic
          );
          return [...updatedTopics].sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.timestamp) - new Date(a.timestamp);
          });
        });
        setNotification({ show: true, message: response.message, type: 'success' });
      }
    } catch (error) {
      console.error('Ошибка закрепления темы:', error);
      setNotification({ show: true, message: 'Не удалось закрепить тему', type: 'error' });
    }
  };

  const handleEditTopic = (topic) => {
     console.log('=== handleEditTopic ===');
    console.log('Полученная тема:', topic);
    console.log('topic.sectionId:', topic.sectionId);
    console.log('topic.section:', topic.section);
    console.log('Все ключи темы:', Object.keys(topic));
    
    setEditingTopic(topic);
    setShowEditTopic(true);
};

  const handleUpdateTopic = async (topicId, updatedData) => {
    try {
      const response = await noteService.updateNote(topicId, updatedData.title, updatedData.content);
      if (response.success) {
        setNotification({ show: true, message: 'Тема успешно обновлена', type: 'success' });
        await loadTopics();
        setShowEditTopic(false);
        setEditingTopic(null);
      }
    } catch (error) {
      setNotification({ show: true, message: 'Не удалось обновить тему', type: 'error' });
    }
  };

const handleCreateTopic = async (topicData) => {
    try {
        console.log('Создание темы:', topicData);
        
        // Проверка авторизации
        if (!localCurrentUser) {
            onShowAuth?.();
            return;
        }
        
        // Проверка на блокировку
        if (localCurrentUser?.isActive === false) {
            alert('Ваш аккаунт заблокирован. Вы не можете создавать темы.');
            return;
        }
        
        const response = await noteService.createNote(topicData);
        
        if (response?.success) {
            setShowCreateTopic(false);
            await loadTopics();  // Обновляем список тем
            refreshAllStats();   // Обновляем статистику
            
            // Показываем уведомление об успехе
            setNotification({ 
                show: true, 
                message: 'Тема успешно создана!', 
                type: 'success' 
            });
            
            // Возвращаемся на главную страницу
            setPreviousPage(null);
        } else {
            throw new Error(response?.message || 'Ошибка создания темы');
        }
    } catch (error) {
        console.error('Ошибка создания темы:', error);
        setNotification({ 
            show: true, 
            message: 'Не удалось создать тему: ' + error.message, 
            type: 'error' 
        });
        throw error; 
    }
};
  const handleCreateTopicClick = () => {
   if (!localCurrentUser) {
        onShowAuth?.();
        return;
    }
    // Запоминаем текущую страницу
    if (showUserProfile) {
        setPreviousPage('profile');
    } else if (showContacts) {
        setPreviousPage('contacts');
    } else if (showInstruction) {
        setPreviousPage('instruction');
    } else if (showAdminPanel) {
        setPreviousPage('admin');
    } else {
        setPreviousPage('home');
    }
    setShowCreateTopic(true);
};

  // Компонент пагинации
  const Pagination = () => {
    if (totalPages <= 1) return null;
    
    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(totalPages, start + maxVisible - 1);
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    };
    
    return (
      <div className="flex justify-center mt-8 gap-2">
        <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="px-4 py-2 rounded-xl border-2 border-purple-200 text-purple-700 hover:bg-purple-50 disabled:opacity-50">← Назад</button>
        {getPageNumbers().map(page => (
          <button key={page} onClick={() => setCurrentPage(page)} className={`px-4 py-2 rounded-xl transition-all ${currentPage === page ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'border-2 border-purple-200 text-purple-700 hover:bg-purple-50'}`}>{page}</button>
        ))}
        <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="px-4 py-2 rounded-xl border-2 border-purple-200 text-purple-700 hover:bg-purple-50 disabled:opacity-50">Вперед →</button>
      </div>
    );
  };

  // Ранние возвраты
  if (showSearchResults) {
    return <SearchResultsPage searchTerm={searchTerm} results={searchResults} onBack={() => setShowSearchResults(false)} onTopicClick={handleTopicClick} loading={searchLoading} />;
  }
if (showMessages && messageRecipient) {
    return <MessagesPage 
        onBack={() => { 
            setShowMessages(false); 
            setMessageRecipient(null); 
        }} 
        recipientId={messageRecipient.id} 
        recipientName={messageRecipient.name} 
        recipientAvatar={messageRecipient.avatar} 
        currentUser={localCurrentUser} 
        onLogout={onLogout} 
        onProfileClick={() => {
            setShowMessages(false);
            setShowUserProfile(true);
        }}
        onContactsClick={() => {
            setShowMessages(false);
            setShowContacts(true);
        }}
        onInstructionClick={() => {
            setShowMessages(false);
            setShowInstruction(true);
        }}
        onSearch={handleSearch} 
        onShowAuth={onShowAuth}
        onAdminPanelClick={() => {
            if (isAdmin) {
                setShowMessages(false);
                setShowAdminPanel(true);
            }
        }}
    />;
}

  if (showAdminPanel) {
      return <AdminUsersPage 
        onBack={() => setShowAdminPanel(false)} 
        currentUser={localCurrentUser} 
        onLogout={onLogout}
        onProfileClick={() => {
            setShowAdminPanel(false);
            setShowUserProfile(true);
        }}
        onContactsClick={() => {
            setShowAdminPanel(false);
            setShowContacts(true);
        }}
        onInstructionClick={() => {
            setShowAdminPanel(false);
            setShowInstruction(true);
        }}
        onSearch={handleSearch}
        onShowAuth={onShowAuth}
        onAdminPanelClick={() => {
            setShowAdminPanel(false);
            setShowAdminPanel(true);
        }}
    />;
}

  if (showEditTopic && editingTopic) {
    return <EditTopicPage 
        onBack={() => { 
            setShowEditTopic(false); 
            setEditingTopic(null);
            loadTopics(); 
        }} 
         onSubmit={handleUpdateTopic}
        currentUser={localCurrentUser}
        topicId={editingTopic.id}
        initialData={{ 
              title: editingTopic.title, 
    content: editingTopic.content, 
    sectionId: editingTopic.sectionId,      
    sectionName: editingTopic.section,      
    categoryType: editingTopic.categoryType,
    categoryTypeName: editingTopic.category
        }}
        onLogout={onLogout}
        onProfileClick={() => {
            setShowEditTopic(false);
            setShowUserProfile(true);
        }}
        onContactsClick={() => {
            setShowEditTopic(false);
            setShowContacts(true);
        }}
        onInstructionClick={() => {
            setShowEditTopic(false);
            setShowInstruction(true);
        }}
        onSearch={handleSearch}
        onShowAuth={onShowAuth}
        onAdminPanelClick={() => {
            if (isAdmin) {
                setShowEditTopic(false);
                setShowAdminPanel(true);
            }
        }}
    />;
}

  if (showInstruction) {
    return <InstructionPage 
        onBack={() => {
            if (previousPage === 'create-topic') {
                setShowInstruction(false);
                setShowCreateTopic(true);
            } else if (previousPage === 'profile') {
                setShowInstruction(false);
                setShowUserProfile(true);
            } else if (previousPage === 'contacts') {
                setShowInstruction(false);
                setShowContacts(true);
            } else if (previousPage === 'admin') {
                setShowInstruction(false);
                setShowAdminPanel(true);
            } else {
                setShowInstruction(false);
            }
            setPreviousPage(null);
        }} 
        currentUser={localCurrentUser}
        onLogout={onLogout}
        onProfileClick={handleNavigateToProfile}
        onContactsClick={handleNavigateToContacts}
        onInstructionClick={() => {}}
        onSearch={handleSearch}
        onShowAuth={onShowAuth}
        onAdminPanelClick={() => {
            if (isAdmin) {
                setPreviousPage('instruction');
                setShowInstruction(false);
                setShowAdminPanel(true);
            }
        }}
    />;
}


if (showContacts) {
    return <ContactPage 
        onBack={() => {
            if (previousPage === 'create-topic') {
                setShowContacts(false);
                setShowCreateTopic(true);
            } else if (previousPage === 'profile') {
                setShowContacts(false);
                setShowUserProfile(true);
            } else if (previousPage === 'instruction') {
                setShowContacts(false);
                setShowInstruction(true);
            } else if (previousPage === 'admin') {
                setShowContacts(false);
                setShowAdminPanel(true);
            } else {
                setShowContacts(false);
            }
            setPreviousPage(null);
        }}
        currentUser={localCurrentUser}
        onLogout={onLogout}
        onProfileClick={handleNavigateToProfile}
        onContactsClick={() => {}}
        onInstructionClick={handleNavigateToInstruction}
        onSearch={handleSearch}
        onShowAuth={onShowAuth}
        onAdminPanelClick={() => {
            if (isAdmin) {
                setPreviousPage('contacts');
                setShowContacts(false);
                setShowAdminPanel(true);
            }
        }}
    />;
}

 if (showUserProfile) {
    return <UserProfilePage 
        onBack={() => {
            if (previousPage === 'create-topic') {
                setShowUserProfile(false);
                setShowCreateTopic(true);
            } else if (previousPage === 'contacts') {
                setShowUserProfile(false);
                setShowContacts(true);
            } else if (previousPage === 'instruction') {
                setShowUserProfile(false);
                setShowInstruction(true);
            } else if (previousPage === 'admin') {
                setShowUserProfile(false);
                setShowAdminPanel(true);
            } else {
                setShowUserProfile(false);
            }
            setPreviousPage(null);
        }}
        onLogout={onLogout}
        onProfileClick={() => {}}
        onContactsClick={handleNavigateToContacts}
        onInstructionClick={handleNavigateToInstruction}
        onSearch={handleSearch}
        onShowAuth={onShowAuth}
        onAdminPanelClick={() => {
            if (isAdmin) {
                setPreviousPage('profile');
                setShowUserProfile(false);
                setShowAdminPanel(true);
            }
        }}
    />;
}

  if (showUserProfileView && viewProfileUserId) {
    return <UserProfileViewPage userId={viewProfileUserId} onBack={() => { setShowUserProfileView(false); setViewProfileUserId(null); loadTopics(); }} currentUser={localCurrentUser} onSendMessage={handleSendMessage} onLogout={onLogout} onProfileClick={() => setShowUserProfile(true)} onContactsClick={() => setShowContacts(true)} onInstructionClick={() => setShowInstruction(true)} onSearch={handleSearch} onShowAuth={onShowAuth} />;
  }

  if (showTopicDetail && selectedTopic) {
    return <TopicDetailPage 
        topic={selectedTopic} 
        onBack={() => { 
            setShowTopicDetail(false);
            
            if (previousPage === 'profile') {
                setShowUserProfile(true);
            } else if (previousPage === 'contacts') {
                setShowContacts(true);
            } else if (previousPage === 'instruction') {
                setShowInstruction(true);
            } else if (previousPage === 'admin') {
                setShowAdminPanel(true);
            } else if (previousPage === 'create-topic') {
                setShowCreateTopic(true);
            } else {
                loadTopics(); 
            }
            
            setPreviousPage(null);
        }} 
        onAddComment={() => {}} 
        onLogout={onLogout} 
        currentUser={localCurrentUser} 
        onShowAuth={onShowAuth}
        onProfileClick={() => {
            setPreviousPage('topic');
            setShowTopicDetail(false);
            setShowUserProfile(true);
        }}
        onContactsClick={() => {
            setPreviousPage('topic');
            setShowTopicDetail(false);
            setShowContacts(true);
        }}
        onInstructionClick={() => {
            setPreviousPage('topic');
            setShowTopicDetail(false);
            setShowInstruction(true);
        }}
        onSearch={handleSearch}
        onAdminPanelClick={() => {
            if (isAdmin) {
                setPreviousPage('topic');
                setShowTopicDetail(false);
                setShowAdminPanel(true);
            }
        }}
    />;
}

 if (showCreateTopic) {
    return <CreateTopicPage 
        onBack={() => {
            setShowCreateTopic(false);
            if (previousPage === 'profile') {
                setShowUserProfile(true);
            } else if (previousPage === 'contacts') {
                setShowContacts(true);
            } else if (previousPage === 'instruction') {
                setShowInstruction(true);
            } else if (previousPage === 'admin') {
                setShowAdminPanel(true);
            } else {
              
            }
            setPreviousPage(null);
        }} 
          onSubmit={handleCreateTopic} 
        currentUser={localCurrentUser}
        onLogout={onLogout}
        onProfileClick={() => {
            setPreviousPage('create-topic');
            setShowCreateTopic(false);
            setShowUserProfile(true);
        }}
        onContactsClick={() => {
            setPreviousPage('create-topic');
            setShowCreateTopic(false);
            setShowContacts(true);
        }}
        onInstructionClick={() => {
            setPreviousPage('create-topic');
            setShowCreateTopic(false);
            setShowInstruction(true);
        }}
        onSearch={handleSearch}
    />;
}

  // Основной рендер
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50">
      {notification.show && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down w-full max-w-md">
          <div className={`rounded-2xl p-4 shadow-xl border backdrop-blur-sm ${notification.type === 'success' ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 text-emerald-800' : 'bg-gradient-to-r from-rose-50 to-red-50 border-red-200 text-red-800'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {notification.type === 'success' ? <CheckCircle className="h-5 w-5 mr-3 text-emerald-600" /> : <X className="h-5 w-5 mr-3 text-red-600" />}
                <div><p className="font-semibold">{notification.type === 'success' ? 'Успешно!' : 'Ошибка!'}</p><p className="text-sm opacity-90">{notification.message}</p></div>
              </div>
              <button onClick={() => setNotification({ ...notification, show: false })} className="ml-4 hover:opacity-70"><X className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      )}
      
      <ForumHeader currentUser={localCurrentUser} onLogout={onLogout} onShowAuth={onShowAuth} onProfileClick={() => setShowUserProfile(true)} onContactsClick={() => setShowContacts(true)} onInstructionClick={() => setShowInstruction(true)} onSettingsClick={() => {}} onNavigateToMessage={handleNavigateToMessage} onAdminPanelClick={handleAdminPanelClick} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3 space-y-6"><ForumCategories onFilterChange={setFilter} /></aside>
          
          <div className="lg:col-span-6">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Последние посты</h2>
                {filter.section && (<p className="text-sm text-gray-500 mt-1">Фильтр: {filter.section}{filter.category ? ` / ${filter.category}` : ''}<button onClick={() => setFilter({ section: null, category: null })} className="ml-2 text-purple-500 hover:text-purple-700 text-xs">(сбросить)</button></p>)}
                {isSearching && (<p className="text-sm text-purple-500 mt-1">Результаты поиска по запросу "{searchQuery}"<button onClick={clearSearch} className="ml-2 text-gray-500 hover:text-gray-700 text-xs">(очистить)</button></p>)}
              </div>
              
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
                  <input type="text" placeholder="Поиск по форуму..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 bg-white/60 border-2 border-purple-200 rounded-xl w-64" />
                  {searchQuery && (<button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>)}
                </div>
                <Button onClick={handleCreateTopicClick} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-6 py-3 rounded-xl font-semibold"><Plus className="h-5 w-5 mr-2" strokeWidth={2.5} />Создать пост</Button>
              </div>
            </div>
            
            {loading ? (
              <div className="space-y-4">{/* скелетон */}</div>
            ) : isSearching ? (
              <div>
                <div className="flex gap-2 mb-4 border-b-2 border-purple-200 pb-2">
                  <button onClick={() => setSearchMode('topics')} className={`px-4 py-2 rounded-lg transition-all ${searchMode === 'topics' ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md' : 'text-purple-700 hover:bg-purple-100'}`}>Посты ({searchResults.topics.length})</button>
                  <button onClick={() => setSearchMode('users')} className={`px-4 py-2 rounded-lg transition-all ${searchMode === 'users' ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md' : 'text-purple-700 hover:bg-purple-100'}`}>Пользователи ({searchResults.users.length})</button>
                </div>
                {searchMode === 'topics' && (
                  searchResults.topics.length === 0 ? <div className="bg-white/80 rounded-2xl p-12 text-center border-2 border-purple-200"><MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">Посты не найдены</p></div>
                  : <div className="space-y-4">{searchResults.topics.map((topic) => (<div key={topic.id} onClick={() => handleTopicClick(topic)} className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"><ForumTopic {...topic} onAuthorClick={handleAuthorClick} status={topic.status} onHideTopic={handleHideTopic} onRestoreTopic={handleRestoreTopic} content={topic.content} sectionId={topic.sectionId} currentUserId={localCurrentUser?.id} currentUserRole={localCurrentUser?.role} onDeleteTopic={handleDeleteTopic} onTogglePin={handleTogglePin} onEditTopic={handleEditTopic} onCommentsClick={() => handleTopicClick(topic)} /></div>))}</div>
                )}
                {searchMode === 'users' && (
                  searchResults.users.length === 0 ? <div className="bg-white/80 rounded-2xl p-12 text-center border-2 border-purple-200"><Users className="h-16 w-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">Пользователи не найдены</p></div>
                  : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{searchResults.users.map((user) => (<div key={user.id} onClick={() => handleUserClickFromSearch(user.id, user.username)} className="bg-white/80 rounded-xl p-4 border-2 border-purple-200 hover:shadow-xl hover:border-purple-400 hover:scale-[1.01] transition-all cursor-pointer flex items-center gap-4"><div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center shadow-md"><Users className="h-7 w-7 text-white" /></div><div className="flex-1"><h3 className="font-semibold text-gray-800">{user.username}</h3><div className="flex items-center gap-2 mt-1"><span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(user.role)}`}>{getRoleDisplayName(user.role)}</span></div></div><Button className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-3 py-1.5 text-sm rounded-lg">Перейти</Button></div>))}</div>
                )}
              </div>
            ) : topics.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center"><MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" /><h3 className="text-xl font-semibold text-gray-600 mb-2">Нет тем</h3><p className="text-gray-500 mb-4">Будьте первым, кто создаст пост в этом разделе!</p><Button onClick={handleCreateTopicClick} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"><Plus className="h-5 w-5 mr-2" />Создать первый пост</Button></div>
            ) : (
              <>
                <div className="space-y-4">{topics.map((topic) => (<div key={topic.id} onClick={() => handleTopicClick(topic)} className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"><ForumTopic {...topic} onAuthorClick={handleAuthorClick} status={topic.status} onHideTopic={handleHideTopic} onRestoreTopic={handleRestoreTopic} content={topic.content} sectionId={topic.sectionId} currentUserId={localCurrentUser?.id} currentUserRole={localCurrentUser?.role} onDeleteTopic={handleDeleteTopic} onTogglePin={handleTogglePin} onEditTopic={handleEditTopic} onCommentsClick={() => handleTopicClick(topic)} /></div>))}</div>
                <Pagination />
                {!loading && topics.length > 0 && <div className="text-center text-sm text-gray-400 mt-4">Показано {topics.length} из {totalPages * itemsPerPage} тем</div>}
              </>
            )}
          </div>
          
          <aside className="lg:col-span-3 space-y-6">
            <ForumStats ref={statsRef} />
            <ActiveUsers ref={activeUsersRef} onUserClick={handleActiveUserClick} />
          </aside>
        </div>
      </main>
      <Footer />
    </div>
    
  );
}

export default MainForum;