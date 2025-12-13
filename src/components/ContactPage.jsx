import { ArrowLeft, Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export function ContactPage({ onBack }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
    setFormData({ name: '', email: '', message: '' });
  };

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
            <h2 className="text-purple-700 font-medium">Контакты</h2>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-300 via-pink-300 to-purple-400 mb-6 shadow-xl">
            <MessageCircle className="h-10 w-10 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent mb-3">
            Свяжитесь с нами
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Мы всегда рады вашим вопросам и предложениям. Выберите удобный способ связи или отправьте нам сообщение через форму обратной связи.
          </p>
        </div>

        {/* Contact Information Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <ContactCard
            icon={<Phone className="h-6 w-6" />}
            title="Телефон"
            content="+7 (495) 123-45-67"
            subtitle="Пн-Пт: 9:00 - 18:00"
            gradient="from-purple-200 to-purple-300"
          />
          <ContactCard
            icon={<Mail className="h-6 w-6" />}
            title="Электронная почта"
            content="support@talkhub.ru"
            subtitle="Ответим в течение 24 часов"
            gradient="from-pink-200 to-pink-300"
          />
          <ContactCard
            icon={<MapPin className="h-6 w-6" />}
            title="Местоположение"
            content="Москва, Россия"
            subtitle="ул. Примерная, д. 123"
            gradient="from-purple-200 to-pink-200"
          />
          <ContactCard
            icon={<Clock className="h-6 w-6" />}
            title="Часы работы"
            content="Пн-Пт: 9:00 - 18:00"
            subtitle="Сб-Вс: выходной"
            gradient="from-pink-200 to-purple-300"
          />
        </div>

        {/* Contact Form and Map Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-purple-200 p-8">
            <h2 className="text-purple-700 font-semibold mb-2">Форма обратной связи</h2>
            <p className="text-gray-600 mb-6">
              Заполните форму, и мы свяжемся с вами как можно скорее
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Ваше имя
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Введите ваше имя"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-purple-200 focus:border-purple-400 focus:outline-none bg-white/50 rounded-xl"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="example@mail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-purple-200 focus:border-purple-400 focus:outline-none bg-white/50 rounded-xl"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-700 mb-2">
                  Сообщение
                </label>
                <textarea
                  id="message"
                  placeholder="Напишите ваше сообщение..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full min-h-[150px] px-4 py-3 border-2 border-purple-200 focus:border-purple-400 focus:outline-none bg-white/50 rounded-xl resize-y"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 hover:from-purple-400 hover:via-pink-400 hover:to-purple-500 text-white font-medium shadow-lg hover:shadow-xl transition-all rounded-xl"
              >
                <Send className="h-5 w-5 mr-2" strokeWidth={2.5} />
                Отправить сообщение
              </button>
            </form>
          </div>

          {/* Additional Information */}
          <div className="space-y-8">
            {/* Map Placeholder */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-purple-200 overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent)]"></div>
                <div className="text-center z-10">
                  <MapPin className="h-16 w-16 text-purple-600 mx-auto mb-4" strokeWidth={1.5} />
                  <p className="text-purple-700 font-medium">Москва, Россия</p>
                  <p className="text-sm text-gray-600">ул. Примерная, д. 123</p>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-purple-200 p-6">
              <h3 className="text-purple-700 font-semibold mb-4">Дополнительная информация</h3>
              <div className="space-y-4">
                <InfoItem
                  title="Техническая поддержка"
                  description="tech@talkhub.ru"
                  icon="💻"
                />
                <InfoItem
                  title="Отдел продаж"
                  description="sales@talkhub.ru"
                  icon="📊"
                />
                <InfoItem
                  title="Общие вопросы"
                  description="info@talkhub.ru"
                  icon="📧"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <button
            onClick={onBack}
            className="flex items-center mx-auto px-6 py-3 border-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Вернуться на главную
          </button>
        </div>
      </main>
    </div>
  );
}

// Вспомогательные компоненты
function ContactCard({ icon, title, content, subtitle, gradient }) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-purple-200 p-6 hover:shadow-xl transition-all hover:scale-[1.02]">
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-md`}>
        <div className="text-white">
          {icon}
        </div>
      </div>
      <h3 className="text-purple-700 font-medium mb-2">{title}</h3>
      <p className="text-gray-800 mb-1">{content}</p>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>
  );
}

function InfoItem({ title, description, icon }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
      <div className="text-2xl flex-shrink-0">{icon}</div>
      <div>
        <h4 className="text-sm text-gray-800 font-medium mb-0.5">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}