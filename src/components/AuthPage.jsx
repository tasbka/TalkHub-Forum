import { useState } from 'react';
import { MessageCircle, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';


export function AuthPage({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

    const API_URL = 'http://localhost:5234/api/users';

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  
  try {
    const url = isLogin ? `${API_URL}/login` : `${API_URL}/register`;
    
    const requestBody = isLogin ? {
      username: formData.username, 
      password: formData.password
    } : {
      username: formData.username,
      email: formData.email,
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
    console.log('Полный ответ от сервера при входе:', result);
      
    if (!response.ok) {
      throw new Error(result.message || 'Произошла ошибка');
    }
    
    if (isLogin) {
      // Сохраняем только data из ответа
      localStorage.setItem('user', JSON.stringify(result.data));
      console.log('Сохраненный пользователь в localStorage:', result.data);
      
      // Вызываем onAuthSuccess
      onAuthSuccess();
    } else {
      alert('Регистрация успешна! Теперь вы можете войти.');
      setIsLogin(true);
      setFormData({ username: '', email: '', password: '' });
    }
  } catch (err) {
    setError(err.message || 'Произошла ошибка');
    console.error('Auth error:', err);
  } finally {
    setLoading(false);
  }
  };

    const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-300 via-pink-200 to-purple-400 shadow-2xl mb-4">
            <MessageCircle className="h-9 w-9 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Добро пожаловать в TalkHub
          </h1>
          <p className="text-gray-600">Сообщество разработчиков Web API</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white/80 rounded-2xl p-8 border-2 border-purple-200 shadow-2xl">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-purple-50 rounded-xl p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-purple-300 via-pink-200 to-purple-300 text-purple-700 shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg transition-all ${
                !isLogin
                  ? 'bg-gradient-to-r from-purple-300 via-pink-200 to-purple-300 text-purple-700 shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-gray-700">
                Имя пользователя
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Введите ваш логин"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:outline-none bg-white/50"
                  required
                />
              </div>
            </div>

            {/* Email (only for registration) */}
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="email" className="block text-gray-700">
                  Электронная почта
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:outline-none bg-white/50"
                    required
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-gray-700">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Введите пароль"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:outline-none bg-white/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password (only for login) */}
            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
                >
                  Забыли пароль?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 hover:from-purple-400 hover:via-pink-400 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              {isLogin ? 'Войти в аккаунт' : 'Создать аккаунт'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-purple-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/80 text-gray-500">
                или продолжить через
              </span>
            </div>
          </div>

          {/* Social Auth */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center py-3 border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 rounded-xl transition-colors"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center py-3 border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 rounded-xl transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Присоединяясь к TalkHub, вы соглашаетесь с{' '}
          <button className="text-purple-600 hover:text-purple-800 transition-colors">
            Условиями использования
          </button>{' '}
          и{' '}
          <button className="text-purple-600 hover:text-purple-800 transition-colors">
            Политикой конфиденциальности
          </button>
        </p>
      </div>
    </div>
  );
}