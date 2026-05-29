import React from 'react';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import { ForumTopic } from './ForumTopic';

export function SearchResultsPage({ searchTerm, results, onBack, onTopicClick, loading }) {
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={onBack}
                        className="flex items-center mb-4 px-4 py-2 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Назад
                    </button>
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Поиск...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button
                    onClick={onBack}
                    className="flex items-center mb-4 px-4 py-2 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Назад
                </button>

                <div className="mb-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                        Результаты поиска
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Найдено {results.length} результатов по запросу "{searchTerm}"
                    </p>
                </div>

                {results.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">Ничего не найдено</h3>
                        <p className="text-gray-500">
                            Попробуйте изменить поисковый запрос или проверьте орфографию
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {results.map((topic) => (
                            <div 
                                key={topic.id} 
                                onClick={() => onTopicClick(topic)}
                                className="cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                            >
                                <ForumTopic {...topic} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}