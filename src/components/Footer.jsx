// src/components/Footer.jsx
import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-purple-200 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-sm text-gray-500">
            © 2025–{currentYear} TalkHub Forum. Все права защищены.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Любое копирование, распространение или модификация программного кода 
            без письменного разрешения правообладателя запрещены.
          </p>
        </div>
      </div>
    </footer>
  );
}