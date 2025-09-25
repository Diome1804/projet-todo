import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import Pagination from '../components/ui/Pagination';
import TaskCard from '../components/tasks/TaskCard';

const TaskPage = () => {
  const {
    filteredTasks,
    loading,
    error,
    setFilters,
    filters,
    pagination,
    changePage,
    changeItemsPerPage
  } = useTasks();
  const navigate = useNavigate();

  useEffect(() => {
    // Désactiver le scroll quand le composant est monté
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Réactiver le scroll quand le composant est démonté
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  const handleSearchChange = (e) => {
    setFilters({ search: e.target.value });
  };

  const handleStatusFilterChange = (e) => {
    setFilters({ status: e.target.value });
  };

  const handleCreateNewTask = () => {
    navigate('/tasks/new');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mes Tâches</h1>
          <button
            onClick={handleCreateNewTask}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            + Nouvelle tâche
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher une tâche..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={filters.status}
              onChange={handleStatusFilterChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">Toutes les tâches</option>
              <option value="completed">Terminées</option>
              <option value="pending">En cours</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="mt-2 text-gray-600">Chargement des tâches...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune tâche trouvée
                </h3>
                <p className="text-gray-500">
                  {filters.search
                    ? 'Essayez de modifier votre recherche'
                    : 'Créez votre première tâche pour commencer'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Composant de pagination */}
        {!loading && !error && filteredTasks.length > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
              onPageChange={changePage}
              onItemsPerPageChange={changeItemsPerPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskPage;
