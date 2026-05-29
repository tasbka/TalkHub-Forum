// src/components/ContactPage.jsx
import { ArrowLeft, Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Layout } from './Layout';

export function ContactPage({ 
    onBack, 
    currentUser, 
    onLogout, 
    onProfileClick, 
    onContactsClick, 
    onInstructionClick, 
    onSearch,
    onShowAuth,
    onAdminPanelClick
}) {
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

  // Обработчики для навигации
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={onBack}
          className="group flex items-center gap-2 mb-6 px-4 py-2 text-purple-600 hover:text-purple-700 rounded-xl transition-all duration-200 hover:bg-purple-50"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Вернуться</span>
        </button>

        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-500 mb-6 shadow-xl">
            <MessageCircle className="h-10 w-10 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
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
            gradient="from-purple-400 to-purple-500"
          />
          <ContactCard
            icon={<Mail className="h-6 w-6" />}
            title="Электронная почта"
            content="support@talkhub.ru"
            subtitle="Ответим в течение 24 часов"
            gradient="from-pink-400 to-pink-500"
          />
          <ContactCard
            icon={<MapPin className="h-6 w-6" />}
            title="Местоположение"
            content="Москва, Россия"
            subtitle="ул. Примерная, д. 123"
            gradient="from-purple-400 to-pink-500"
          />
          <ContactCard
            icon={<Clock className="h-6 w-6" />}
            title="Часы работы"
            content="Пн-Пт: 9:00 - 18:00"
            subtitle="Сб-Вс: выходной"
            gradient="from-pink-400 to-purple-500"
          />
        </div>

        {/* Contact Form and Map Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-purple-200 p-8 shadow-lg">
            <h2 className="text-purple-800 font-semibold text-xl mb-2">Форма обратной связи</h2>
            <p className="text-gray-500 mb-6">
              Заполните форму, и мы свяжемся с вами как можно скорее
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">
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
                <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
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
                <label htmlFor="message" className="block text-gray-700 mb-2 font-medium">
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
                className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium shadow-lg hover:shadow-xl transition-all rounded-xl"
              >
                <Send className="h-5 w-5 mr-2" strokeWidth={2.5} />
                Отправить сообщение
              </button>
            </form>
          </div>

          {/* Additional Information */}
          <div className="space-y-8">
            {/* Map Placeholder */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-purple-200 overflow-hidden shadow-lg">
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
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-purple-200 p-6 shadow-lg">
              <h3 className="text-purple-800 font-semibold text-lg mb-4">Дополнительная информация</h3>
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
      </div>
    </Layout>
  );
}

// Вспомогательные компоненты
function ContactCard({ icon, title, content, subtitle, gradient }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-purple-200 p-6 hover:shadow-xl transition-all hover:scale-[1.02] shadow-lg">
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-md`}>
        <div className="text-white">
          {icon}
        </div>
      </div>
      <h3 className="text-purple-800 font-semibold mb-2">{title}</h3>
      <p className="text-gray-700 mb-1">{content}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

function InfoItem({ title, description, icon }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
      <div className="text-2xl flex-shrink-0">{icon}</div>
      <div>
        <h4 className="text-sm text-gray-800 font-semibold mb-0.5">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}