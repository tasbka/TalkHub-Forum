import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Code, HelpCircle, MessageSquare, TrendingUp } from 'lucide-react';
import sectionService from '../services/sectionService';

export const ForumCategories = forwardRef(({ onFilterChange }, ref) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSections = async () => {
    try {
      setLoading(true);
      const data = await sectionService.getAllSections();
      console.log('Loaded sections from API:', JSON.stringify(data, null, 2));
      setSections(data);
    } catch (error) {
      console.error('Error loading sections:', error);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    loadSections
  }));

  useEffect(() => {
    loadSections();
  }, []);

  const getSectionIcon = (sectionName) => {
    switch(sectionName) {
      case 'C++': return Code;
      case 'C#': return Code;
      case 'Web': return Code;
      default: return Code;
    }
  };

  const getSectionColor = (sectionName) => {
    switch(sectionName) {
      case 'C++': return 'from-blue-300 to-cyan-300';
      case 'C#': return 'from-purple-300 to-violet-300';
      case 'Web': return 'from-pink-300 to-rose-300';
      default: return 'from-gray-300 to-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/80 rounded-xl p-5 border-2 border-purple-200 shadow-lg">
        <h3 className="text-purple-700 font-semibold mb-4">Разделы</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!sections || sections.length === 0) {
    return (
      <div className="bg-white/80 rounded-xl p-5 border-2 border-purple-200 shadow-lg">
        <h3 className="text-purple-700 font-semibold mb-4">Разделы</h3>
        <div className="text-center py-8 text-gray-500">
          <p>Нет доступных разделов</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 rounded-xl p-5 border-2 border-purple-200 shadow-lg">
      <h3 className="text-purple-700 font-semibold mb-4">Разделы</h3>
      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = getSectionIcon(section.name);
          const sectionColor = getSectionColor(section.name);
          
          return (
            <div key={section.id} className="space-y-2">
              {/* Кнопка секции */}
              <button
                onClick={() => onFilterChange?.(section.name, null)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all bg-gradient-to-r ${sectionColor} text-purple-700 shadow-md hover:shadow-lg hover:scale-[1.01]`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-white/40">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-semibold">{section.name}</span>
                </div>
                <span className="text-sm font-bold bg-white/30 px-2 py-0.5 rounded-full">
                  {section.totalTopics || 0}
                </span>
              </button>
              
              {/* Подкатегории (Вопросы, Обсуждения) */}
              {section.categories && section.categories.length > 0 && (
                <div className="pl-4 space-y-1">
                  {section.categories.map((category) => {
                    const SubIcon = category.name === 'Вопросы' ? HelpCircle : MessageSquare;
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => onFilterChange?.(section.name, category.name)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <SubIcon className="h-3.5 w-3.5 text-gray-500" />
                          <span className="text-sm">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700">
                            {category.postCount || 0}
                          </span>
                          {category.todayTopics > 0 && (
                            <span className="text-xs text-green-600 flex items-center">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              +{category.todayTopics}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});