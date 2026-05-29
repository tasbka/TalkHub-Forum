import { useState } from 'react';
import { MessageCircle, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, X } from 'lucide-react';

export function AuthPage({ onAuthSuccess, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const API_URL = 'http://localhost:5234/api/users';

  const LATIN_REGEX = /^[a-zA-Z0-9_\-@.]+$/;
  const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validateForm = () => {
    const newErrors = {};
    
    setSuccessMessage('');

    if (!formData.username.trim()) {
      newErrors.username = 'Имя пользователя обязательно';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Имя пользователя должно быть не менее 3 символов';
    } else if (formData.username.length > 20) {
      newErrors.username = 'Имя пользователя должно быть не более 20 символов';
    } else if (!USERNAME_REGEX.test(formData.username)) {
      newErrors.username = 'Имя пользователя должно содержать только латинские буквы, цифры и символ подчеркивания';
    } else if (formData.username.includes(' ')) {
      newErrors.username = 'Имя пользователя не должно содержать пробелов';
    }

    if (!isLogin) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email обязателен';
      } else if (!EMAIL_REGEX.test(formData.email)) {
        newErrors.email = 'Некорректный формат email';
      } else if (!LATIN_REGEX.test(formData.email)) {
        newErrors.email = 'Email должен содержать только латинские символы';
      }
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    } else if (formData.password.length > 50) {
      newErrors.password = 'Пароль должен быть не более 50 символов';
    } else if (formData.password.includes(' ')) {
      newErrors.password = 'Пароль не должен содержать пробелов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const url = isLogin ? `${API_URL}/login` : `${API_URL}/register`;
      
      const requestBody = isLogin ? {
        username: formData.username.trim(),
        password: formData.password
      } : {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password
      };
      
      console.log('Отправляемые данные:', requestBody);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('Статус ответа:', response.status);
      
      const result = await response.json();
      console.log('Полный ответ от сервера:', result);
      
      if (!response.ok) {
        if (result.errors) {
          const backendErrors = {};
          Object.keys(result.errors).forEach(key => {
            backendErrors[key] = result.errors[key].join(', ');
          });
          setErrors(backendErrors);
          return;
        }

        let errorMessage = result.message || 'Произошла ошибка';
        let field = 'general';
        
        if (result.message) {
          const msg = result.message.toLowerCase();
          
          if (msg.includes('username') || msg.includes('логин') || msg.includes('пользователь')) {
            field = 'username';
          } else if (msg.includes('email') || msg.includes('почта') || msg.includes('электронная')) {
            field = 'email';
          } else if (msg.includes('password') || msg.includes('пароль')) {
            field = 'password';
          }
          
          if (msg.includes('already exists') || msg.includes('уже существует')) {
            if (msg.includes('username') || msg.includes('логин')) {
              errorMessage = 'Это имя пользователя уже занято';
            } else if (msg.includes('email')) {
              errorMessage = 'Этот email уже зарегистрирован';
            }
          } else if (msg.includes('invalid') || msg.includes('неверный')) {
            if (msg.includes('username') || msg.includes('password')) {
              errorMessage = 'Неверное имя пользователя или пароль';
            }
          }
        }
        
        setErrors({ [field]: errorMessage });
        return;
      }
      
      if (isLogin) {
        const userData = {
          id: result.data.id,
          username: result.data.username,
          email: result.data.email,
          role: result.data.roleType || result.data.role,
          postCount: result.data.postCount || 0,
          commentCount: result.data.commentCount || 0,
          experiencePoints: result.data.experiencePoints || 0,
          reputation: result.data.reputation || 0,
          createdAt: result.data.createdAt
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('Сохраненный пользователь в localStorage:', userData);

        onAuthSuccess(userData);
      } else {
        setSuccessMessage('Регистрация успешна! Теперь вы можете войти.');
        
        setFormData({ username: '', email: '', password: '' });

        setTimeout(() => {
          setIsLogin(true);
          setErrors({});
          setSuccessMessage('');
        }, 2000);
      }
      
    } catch (err) {
      console.error('Auth error:', err);
      setErrors({ 
        general: 'Ошибка сети или сервера. Попробуйте позже.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = name !== 'password' ? value.trimStart() : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: trimmedValue,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    if (errors.general) {
      setErrors(prev => ({
        ...prev,
        general: undefined
      }));
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const renderFieldError = (fieldName) => {
    if (errors[fieldName]) {
      return (
        <div className="flex items-center mt-1 text-sm text-red-600 animate-fadeIn">
          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
          <span>{errors[fieldName]}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-2xl">
      {/* Кнопка закрытия */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 z-10"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="p-8">
        {/* Logo and Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-300 via-pink-200 to-purple-400 shadow-2xl mb-3">
            <MessageCircle className="h-7 w-7 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent mb-1">
            TalkHub
          </h1>
          <p className="text-gray-500 text-sm">Войдите или создайте аккаунт</p>
        </div>

        {/* Auth Form */}
        <div>
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700 animate-fadeIn">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
          
          {/* General Error Message */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 animate-fadeIn">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-purple-50 rounded-xl p-1">
            <button
              onClick={() => {
                setIsLogin(true);
                setErrors({});
                setSuccessMessage('');
              }}
              className={`flex-1 py-2.5 rounded-lg transition-all text-sm font-medium ${
                isLogin
                  ? 'bg-gradient-to-r from-purple-300 via-pink-200 to-purple-300 text-purple-700 shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setErrors({});
                setSuccessMessage('');
              }}
              className={`flex-1 py-2.5 rounded-lg transition-all text-sm font-medium ${
                !isLogin
                  ? 'bg-gradient-to-r from-purple-300 via-pink-200 to-purple-300 text-purple-700 shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-1">
              <label htmlFor="username" className="block text-gray-700 text-sm font-medium">
                Имя пользователя
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Введите ваш логин"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-3 py-2.5 border-2 rounded-xl focus:outline-none bg-white/50 text-sm ${
                    errors.username 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-purple-200 focus:border-purple-400'
                  }`}
                  disabled={loading}
                />
              </div>
              {renderFieldError('username')}
            </div>

            {/* Email (only for registration) */}
            {!isLogin && (
              <div className="space-y-1">
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium">
                  Электронная почта
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-3 py-2.5 border-2 rounded-xl focus:outline-none bg-white/50 text-sm ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-purple-200 focus:border-purple-400'
                    }`}
                    disabled={loading}
                  />
                </div>
                {renderFieldError('email')}
              </div>
            )}

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Введите пароль"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-9 py-2.5 border-2 rounded-xl focus:outline-none bg-white/50 text-sm ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-purple-200 focus:border-purple-400'
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {renderFieldError('password')}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 hover:from-purple-500 hover:via-pink-500 hover:to-purple-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  {isLogin ? 'Вход...' : 'Регистрация...'}
                </span>
              ) : (
                <span>{isLogin ? 'Войти' : 'Зарегистрироваться'}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}