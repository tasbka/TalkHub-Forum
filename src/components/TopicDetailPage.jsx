// src/components/TopicDetailPage.jsx
import { useState, useEffect } from 'react';
import { ArrowLeft, Send, Pin, Eye, MessageSquare, AlertCircle, Paperclip, Image, FileText, Download, Trash2, User, Calendar, Clock, MessageCircle as MsgIcon, Heart, CheckCircle, XCircle} from 'lucide-react';
import { Comment } from './Comment';
import { Layout } from './Layout';
import commentService from '../services/commentService';
import noteService from '../services/noteService';
import attachmentService from '../services/attachmentService';

export function TopicDetailPage({  
    topic, 
    onBack, 
    onAddComment, 
    onLogout, 
    currentUser, 
    onProfileClick, 
    onContactsClick, 
    onInstructionClick, 
    onSearch, 
    onShowAuth,
    onAdminPanelClick
}) {
 const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [authError, setAuthError] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [attachmentsLoading, setAttachmentsLoading] = useState(true);
  const [isSolved, setIsSolved] = useState(topic.isSolved || false);
  const [solvingLoading, setSolvingLoading] = useState(false);
  const [viewCounted, setViewCounted] = useState(false);
  
const isQuestion = topic.category === 'Вопрос' || topic.category === 'Вопросы';
const canMarkSolved = currentUser && (currentUser.id === topic.authorId || 
    currentUser.role === 'Admin' || currentUser.role === 'Администратор') && isQuestion;

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

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.href = '/';
    }
  };

  useEffect(() => {
    loadComments();
    loadAttachments();

    if (!viewCounted && topic?.id) {
      incrementViewCount();
    }
  }, [topic.id]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const commentsData = await commentService.getCommentsByNote(topic.id);
      console.log('Загруженные комментарии:', commentsData);
      setComments(commentsData);
    } catch (error) {
      console.error('Ошибка загрузки комментариев:', error);
    } finally {
      setLoading(false);
    }
  };

 const incrementViewCount = async () => {
    try {
      await noteService.incrementViewCount(topic.id);
      setViewCounted(true);
    } catch (error) {
      console.error('Ошибка увеличения просмотров:', error);
    }
  };
  

  const loadAttachments = async () => {
    try {
      setAttachmentsLoading(true);
      const files = await attachmentService.getAttachmentsByNote(topic.id);
      console.log('Загруженные файлы:', files);
      setAttachments(files);
    } catch (error) {
      console.error('Ошибка загрузки файлов:', error);
    } finally {
      setAttachmentsLoading(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    if (!window.confirm('Удалить этот файл?')) return;
    
    try {
      await attachmentService.deleteAttachment(attachmentId);
      setAttachments(prev => prev.filter(a => a.id !== attachmentId));
    } catch (error) {
      console.error('Ошибка удаления файла:', error);
      alert('Не удалось удалить файл');
    }
  };

  const handleDownload = (attachment) => {
    attachmentService.downloadFile(attachment.id, attachment.fileName);
  };

  const getFileIcon = (contentType) => {
    if (contentType?.startsWith('image/')) return <Image className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleAuthCheck = () => {
    if (!currentUser) {
      setAuthError('Для этого действия необходимо войти в аккаунт');
      return false;
    }
    setAuthError('');
    return true;
  };

const handleToggleSolved = async () => {
    if (!canMarkSolved) return;
    
    setSolvingLoading(true);
    try {
      const response = await noteService.toggleSolved(topic.id);
      if (response.success) {
        setIsSolved(!isSolved);
        topic.isSolved = !isSolved;
      }
    } catch (error) {
      console.error('Ошибка изменения статуса:', error);
      alert('Не удалось изменить статус вопроса');
    } finally {
      setSolvingLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
   if (currentUser?.isActive === false) {
    setAuthError('Ваш аккаунт заблокирован. Вы не можете оставлять комментарии.');
    return;
  }
     if (!currentUser) {
        if (onShowAuth) onShowAuth();
        return;
    }
    if (!newComment.trim()) return;
    
    try {
      const commentData = {
        noteId: topic.id,
        authorId: currentUser.id,
        authorName: currentUser.username,
        authorAvatar: currentUser.avatar || '👤',
        content: newComment.trim(),
        parentCommentId: null
      };

      const createdComment = await commentService.createComment(commentData);
      setComments(prev => [...prev, createdComment]);
      setNewComment('');
      
      if (onAddComment) {
        onAddComment(createdComment);
      }
      
    } catch (error) {
      console.error('Ошибка создания комментария:', error);
      alert('Не удалось отправить комментарий: ' + (error.message || error));
    }
  };

  const handleSubmitReply = async (parentComment) => {
    if (!replyContent.trim()) return;
    
    if (!handleAuthCheck()) return;

    try {
      const replyData = {
        noteId: topic.id,
        authorId: currentUser.id,
        authorName: currentUser.username,
        authorAvatar: currentUser.avatar || '👤',
        content: replyContent.trim(),
        parentCommentId: parentComment.id
      };

      const reply = await commentService.createComment(replyData);
      await loadComments();
      setReplyingTo(null);
      setReplyContent('');
      
    } catch (error) {
      console.error('Ошибка отправки ответа:', error);
    }
  };

  const handleReply = (comment) => {
    if (!currentUser) {
      setAuthError('Для ответа на комментарий необходимо войти в аккаунт');
      return;
    }
    setAuthError('');
    setReplyingTo(comment);
  };

  const handleDeleteComment = async (commentId) => {
  try {
    const response = await commentService.deleteComment(commentId);
    if (response.success) {
      await loadComments();
      if (onAddComment) {
        onAddComment({ type: 'delete' });
      }
    } else {
      alert(response.message || 'Ошибка удаления');
    }
  } catch (error) {
    console.error('Ошибка удаления комментария:', error);
    alert('Не удалось удалить комментарий');
  }
};

  const handleNavigateToAuth = () => {
    setAuthError('Пожалуйста, войдите в систему для выполнения этого действия');
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} ч назад`;
    return date.toLocaleDateString();
  };

  const getCategoryColor = (category) => {
    if (category === 'Вопрос' || category === 'Вопросы') return 'from-orange-500 to-amber-500';
    return 'from-green-500 to-emerald-500';
  };

  const getSectionColor = (section) => {
    switch(section) {
      case 'C++': return 'from-blue-600 to-cyan-600';
      case 'C#': return 'from-purple-600 to-violet-600';
      case 'Web': return 'from-pink-600 to-rose-600';
      default: return 'from-purple-600 to-pink-600';
    }
  };

 const renderComments = (commentList, level = 0) => {
  return commentList.map(comment => {
    const isCurrentUserAuthor = currentUser && currentUser.id === comment.authorId;
    const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Администратор';

      return (
        <div key={comment.id} className={level > 0 ? 'ml-8 mt-3 border-l-2 border-purple-200 pl-5' : ''}>
          <Comment
            author={comment.authorName}
            content={comment.content}
            timestamp={formatTime(comment.createdAt)}
            avatar={comment.authorAvatar}
            isAuthor={isCurrentUserAuthor}
            onReply={() => handleReply(comment)}
              onDelete={async () => {
            if (window.confirm('Удалить этот комментарий?')) {
              await handleDeleteComment(comment.id);
            }
          }}
          />
          
          {replyingTo?.id === comment.id && (
            <div className="ml-10 mt-3 bg-purple-50/80 backdrop-blur-sm rounded-xl p-4 border border-purple-200">
              <textarea
                placeholder={`Ответить ${comment.authorName}...`}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full min-h-[80px] px-4 py-2 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/80"
              />
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleSubmitReply(comment)}
                  className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-md transition-all"
                >
                  Отправить
                </button>
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setAuthError('');
                  }}
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            renderComments(comment.replies, level + 1)
          )}
        </div>
      );
    });
  };

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
            <p className="text-gray-500">Загрузка...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Администратор';
console.log('=== ПОЛНЫЙ ТЕКСТ ПОСТА ===');
console.log(topic.content);
console.log('ДЛИНА:', topic.content?.length);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="group flex items-center gap-2 mb-6 px-4 py-2 text-purple-600 hover:text-purple-700 rounded-xl transition-all duration-200 hover:bg-purple-50"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Назад</span>
          </button>

          {/* Topic Card */}
          <div className="relative group mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-purple-100 overflow-hidden shadow-xl">
              {/* Header gradient */}
   <div className="min-h-28 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 relative py-4">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent)]"></div>
    {topic.isPinned && (
        <div className="absolute top-4 right-4 px-3 py-1.5 bg-yellow-500/20 backdrop-blur-sm rounded-full">
            <Pin className="h-4 w-4 text-yellow-600" fill="currentColor" />
        </div>
    )}
</div>
              
              <div className="px-8 pb-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 -mt-12 relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl border-4 border-white ring-4 ring-purple-100">
                    <span className="text-3xl">{topic.avatar || '👤'}</span>
                  </div>
        <div className="flex-1 min-w-0 overflow-hidden">
 <h1 
  className="text-2xl font-bold text-white mb-2"
  style={{ 
    wordWrap: 'break-word', 
    wordBreak: 'break-word',
    whiteSpace: 'normal',
    maxWidth: '100%'
  }}
>
  {topic.title}
</h1>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <User className="h-4 w-4 text-purple-400" />
                        <span className="font-medium">{topic.author}</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Calendar className="h-4 w-4 text-pink-400" />
                        <span>{topic.timestamp}</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <MsgIcon className="h-4 w-4 text-purple-400" />
                        <span>{comments.length} {comments.length === 1 ? 'комментарий' : comments.length >= 2 && comments.length <= 4 ? 'комментария' : 'комментариев'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="flex items-center gap-2 mt-5 flex-wrap">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${getSectionColor(topic.section)} text-white shadow-sm`}>
                    {topic.section === 'C++' && '🔷'}
                    {topic.section === 'C#' && '🟣'}
                    {topic.section === 'Web' && '🌐'}
                    {topic.section}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(topic.category)} text-white shadow-sm`}>
                    {topic.category === 'Вопрос' || topic.category === 'Вопросы' ? '❓' : '💬'}
                    {topic.category}
                  </span>

                  {/* Статус "Решено" (если уже отмечено) */}
                  {isSolved && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm">
                      <CheckCircle className="h-3 w-3" />
                      Решено
                    </span>
                  )}
                </div>
                {/* Кнопка "Отметить как решенное" (только для вопросов и автора/админа) */}
                {canMarkSolved && (
                  <button
                    onClick={handleToggleSolved}
                    disabled={solvingLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      isSolved
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-md'
                    }`}
                  >
                    {solvingLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : isSolved ? (
                      <>
                        <XCircle className="h-4 w-4" />
                        Снять отметку
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Отметить как решённое
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
 {/* Content */}
{topic.content && (
  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-100 shadow-lg mb-6">
    <pre className="text-gray-700 font-sans whitespace-pre-wrap break-words leading-relaxed">
      {topic.content}
    </pre>
  </div>
)}

          {/* Attachments */}
          {!attachmentsLoading && attachments.length > 0 && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-100 shadow-lg mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Paperclip className="h-5 w-5 text-purple-500" />
                <h3 className="text-purple-800 font-semibold">Вложения ({attachments.length})</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {attachments.map((file) => (
                  <div key={file.id} className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 text-purple-500">
                        {getFileIcon(file.contentType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 font-medium truncate" title={file.fileName}>
                          {file.fileName}
                        </p>
                        <p className="text-xs text-gray-400">{formatFileSize(file.fileSize)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDownload(file)}
                        className="p-2 text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Скачать"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteAttachment(file.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Удалить"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-5 px-2 mb-6">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Eye className="h-4 w-4 text-gray-400" />
              <span>{topic.views || 0} просмотров</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Heart className="h-4 w-4 text-pink-400" />
              <span>{topic.likes || 0} лайков</span>
            </div>
          </div>

          {/* Auth error */}
          {authError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-700">{authError}</span>
              </div>
              <button
                onClick={handleNavigateToAuth}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Войти
              </button>
            </div>
          )}

          {/* Comments section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-purple-600 mb-5">
              Комментарии <span className="text-purple-500">({comments.length})</span>
            </h2>
            
            {comments.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 text-center border-2 border-dashed border-purple-200">
                <MessageSquare className="h-14 w-14 text-purple-300 mx-auto mb-4" />
                <p className="text-gray-500">Пока нет комментариев. Будьте первым!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {renderComments(comments)}
              </div>
            )}
          </div>

          {/* Add comment form */}
          {currentUser ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-100 shadow-lg">
              <h3 className="text-purple-800 font-semibold mb-4">
                💬 Добавить комментарий
              </h3>
              <form onSubmit={handleSubmitComment}>
                <textarea
                  placeholder="Напишите ваш комментарий..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full min-h-[120px] px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/80 resize-y"
                  required
                />
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" strokeWidth={2.5} />
                    Отправить
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 text-center border border-purple-100 shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Только для авторизованных
              </h3>
              <p className="text-gray-500 mb-4">
                Чтобы оставлять комментарии, необходимо войти в аккаунт
              </p>
              <button
                onClick={() => {
                  if (onShowAuth) {
                    onShowAuth();
                  } else {
                    handleNavigateToAuth();
                  }
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Войти в аккаунт
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}