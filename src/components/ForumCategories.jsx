import React, { useState, useEffect } from 'react';
import statsService from '../services/statsService';
import { Code, MessageSquare, HelpCircle, Lightbulb, TrendingUp } from 'lucide-react';

export function ForumCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await statsService.getCategoryStats();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (name) => {
    switch(name) {
      case 'API Docs': return <Code className="h-5 w-5 text-blue-600" />;
      case 'Обсуждения': return <MessageSquare className="h-5 w-5 text-green-600" />;
      case 'Вопросы': return <HelpCircle className="h-5 w-5 text-red-600" />;
      case 'Идеи': return <Lightbulb className="h-5 w-5 text-yellow-600" />;
      default: return <Code className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Категории</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-primary mb-6">Категории</h3>
      
      <div className="space-y-4">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                {getCategoryIcon(category.name)}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{category.name}</h4>
                <p className="text-xs text-gray-500 truncate max-w-[180px]">
                  {category.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="font-semibold text-gray-900">{category.topicCount}</div>
                {category.todayTopics > 0 && (
                  <div className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{category.todayTopics}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}