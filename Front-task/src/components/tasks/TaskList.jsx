import React from 'react';
import { Loader } from '../ui/index.js';
import { useTasks } from '../../hooks/useTasks.js';
import TaskCard from './TaskCard.jsx';

const TaskList = ({ showFilters = true }) => {
  const {
    filteredTasks,
    loading,
    error,
    filters,
    setFilters
  } = useTasks();

  const handleStatusFilter = (status) => {
    setFilters({ status });
  };

  const handleSearch = (e) => {
    setFilters({ search: e.target.value });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-emerald-600 hover:text-emerald-800 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.status === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Toutes ({filteredTasks.length})
            </button>
            <button
              onClick={() => handleStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.status === 'pending'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              En cours
            </button>
            <button
              onClick={() => handleStatusFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.status === 'completed'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Terminées
            </button>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Rechercher une tâche..."
              value={filters.search}
              onChange={handleSearch}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filters.search ? 'Aucune tâche trouvée' : 'Aucune tâche'}
          </h3>
          <p className="text-gray-500">
            {filters.search
              ? 'Essayez de modifier votre recherche'
              : 'Créez votre première tâche pour commencer'
            }
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TaskList;
