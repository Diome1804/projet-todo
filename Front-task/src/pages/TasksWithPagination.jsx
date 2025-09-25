import React from 'react';
import { PaginatedTaskProvider } from '../context/PaginatedTaskContext.jsx';
import PaginatedTaskList from '../components/tasks/PaginatedTaskList.jsx';

const TasksWithPagination = () => {
  return (
    <PaginatedTaskProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📋 Gestion des Tâches (avec Pagination)
          </h1>
          <p className="text-gray-600">
            Gérez vos tâches avec pagination et filtres avancés
          </p>
        </div>
        
        <PaginatedTaskList />
      </div>
    </PaginatedTaskProvider>
  );
};

export default TasksWithPagination;