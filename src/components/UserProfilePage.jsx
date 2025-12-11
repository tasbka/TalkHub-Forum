import { ArrowLeft, Construction, User, Settings, Mail, Calendar, MessageCircle, Award } from 'lucide-react';

export function UserProfilePage({ onBack, username = "Пользователь" }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 border-b-2 border-purple-300 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Вернуться</span>
            </button>
            <h2 className="text-purple-700 font-medium">Профиль пользователя</h2>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-purple-200 overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent)]"></div>
          </div>
          <div className="px-8 pb-8">
            <div className="flex items-end gap-6 -mt-16 relative">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center shadow-2xl border-4 border-white">
                <User className="h-16 w-16 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1 pt-20">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                  {username}
                </h1>
                <p className="text-gray-600">Участник форума TalkHub</p>
              </div>
            </div>
          </div>
        </div>

        {/* Under Construction Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-purple-200 p-12 mb-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200 mb-4">
              <Construction className="h-12 w-12 text-purple-600" strokeWidth={2} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                Страница в разработке
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Мы работаем над созданием полноценного профиля пользователя. 
                Скоро здесь появится много интересного!
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <div className="w-3 h-3 rounded-full bg-purple-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 rounded-full bg-pink-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>

        {/* Planned Features */}
        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard
            icon={<MessageCircle className="h-6 w-6" />}
            title="История сообщений"
            description="Все ваши темы и комментарии"
          />
          <FeatureCard
            icon={<Award className="h-6 w-6" />}
            title="Достижения"
            description="Награды и репутация"
          />
          <FeatureCard
            icon={<Calendar className="h-6 w-6" />}
            title="Активность"
            description="Статистика участия в форуме"
          />
          <FeatureCard
            icon={<Settings className="h-6 w-6" />}
            title="Настройки"
            description="Персонализация профиля"
          />
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <button
            onClick={onBack}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 hover:from-purple-400 hover:via-pink-400 hover:to-purple-500 text-white font-medium shadow-lg hover:shadow-xl transition-all rounded-xl"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Вернуться на главную
          </button>
        </div>
      </main>
    </div>
  );
}

// Вспомогательный компонент FeatureCard
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl border-2 border-purple-200 p-6 hover:shadow-lg transition-all hover:border-purple-300">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center flex-shrink-0">
          <div className="text-purple-600">
            {icon}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-purple-700 font-medium mb-1">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}