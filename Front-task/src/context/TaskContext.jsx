import React, { createContext, useContext, useReducer, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import { taskService } from '../services/taskServiceUpdated.js';

// État initial
const initialState = {
  tasks: [],
  loading: false,
  error: null,
  filters: {
    status: 'all', // all, completed, pending
    search: '',
  },
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 5,
    hasNextPage: false,
    hasPrevPage: false
  }
};

// Actions
const TASK_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_TASKS: 'SET_TASKS',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
};

// Reducer
const taskReducer = (state, action) => {
  switch (action.type) {
    case TASK_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case TASK_ACTIONS.SET_TASKS:
      return { 
        ...state, 
        tasks: Array.isArray(action.payload) ? action.payload : [], 
        loading: false, 
        error: null 
      };

    case TASK_ACTIONS.ADD_TASK:
      return { 
        ...state, 
        tasks: [...(Array.isArray(state.tasks) ? state.tasks : []), action.payload] 
      };

    case TASK_ACTIONS.UPDATE_TASK:
      return {
        ...state,
        tasks: Array.isArray(state.tasks) ? state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        ) : [],
      };

    case TASK_ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: Array.isArray(state.tasks) ? state.tasks.filter(task => task.id !== action.payload) : [],
      };

    case TASK_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case TASK_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case TASK_ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case TASK_ACTIONS.SET_PAGINATION:
      return { ...state, pagination: { ...state.pagination, ...action.payload } };

    default:
      return state;
  }
};

// Création du contexte
const TaskContext = createContext();

// Provider
export const TaskProvider = forwardRef(({ children }, ref) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Actions avec useCallback pour éviter les re-renders inutiles
  const loadTasks = useCallback(async () => {
    try {
      dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
      
      const result = await taskService.getTasks(
        state.pagination.currentPage,
        state.pagination.itemsPerPage,
        state.filters.search,
        state.filters.status
      );
      
      // Extraire les tâches et les informations de pagination
      const tasks = result.tasks || [];
      const paginationInfo = result.pagination || {};
      
      dispatch({ type: TASK_ACTIONS.SET_TASKS, payload: tasks });
      dispatch({ type: TASK_ACTIONS.SET_PAGINATION, payload: paginationInfo });
    } catch (error) {
      dispatch({
        type: TASK_ACTIONS.SET_ERROR,
        payload: error.response?.data?.message || 'Erreur lors du chargement des tâches',
      });
    }
  }, [state.pagination.currentPage, state.pagination.itemsPerPage, state.filters.search, state.filters.status]);

  const initializeTasks = useCallback(async () => {
    try {
      await loadTasks();
    } catch (error) {
      console.log('Backend non disponible, les tâches se chargeront plus tard');
      dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: false });
    }
  }, [loadTasks]);

  // Exposer la méthode initializeTasks via ref
  useImperativeHandle(ref, () => ({
    initializeTasks
  }));

  // Charger les tâches au montage et quand les paramètres changent
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const createTask = async (taskData) => {
    try {
      // Créer la tâche avec la photo directement (comme dans Postman)
      const taskToCreate = { ...taskData };
      const newTask = await taskService.createTask(taskToCreate);
      dispatch({ type: TASK_ACTIONS.ADD_TASK, payload: newTask });
      return newTask;
    } catch (error) {
      dispatch({
        type: TASK_ACTIONS.SET_ERROR,
        payload: error.response?.data?.message || 'Erreur lors de la création de la tâche',
      });
      throw error;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      dispatch({ type: TASK_ACTIONS.UPDATE_TASK, payload: updatedTask });
      return updatedTask;
    } catch (error) {
      dispatch({
        type: TASK_ACTIONS.SET_ERROR,
        payload: error.response?.data?.message || 'Erreur lors de la mise à jour de la tâche',
      });
      throw error;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      dispatch({ type: TASK_ACTIONS.DELETE_TASK, payload: id });
    } catch (error) {
      let errorMessage = 'Erreur lors de la suppression de la tâche';

      if (error.response?.status === 403) {
        errorMessage = 'Vous n\'avez pas l\'autorisation de supprimer cette tâche';
      } else if (error.response?.status === 404) {
        errorMessage = 'Tâche introuvable';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      dispatch({
        type: TASK_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      throw error;
    }
  };

  const toggleTaskStatus = async (id) => {
    try {
      const updatedTask = await taskService.completeTask(id);
      dispatch({ type: TASK_ACTIONS.UPDATE_TASK, payload: updatedTask });
      return updatedTask;
    } catch (error) {
      dispatch({
        type: TASK_ACTIONS.SET_ERROR,
        payload: error.response?.data?.message || 'Erreur lors du changement de statut',
      });
      throw error;
    }
  };

  const setFilters = (filters) => {
    // Réinitialiser à la page 1 quand on change les filtres
    dispatch({ type: TASK_ACTIONS.SET_PAGINATION, payload: { currentPage: 1 } });
    dispatch({ type: TASK_ACTIONS.SET_FILTERS, payload: filters });
  };

  const changePage = (page) => {
    dispatch({ type: TASK_ACTIONS.SET_PAGINATION, payload: { currentPage: page } });
  };

  const changeItemsPerPage = (itemsPerPage) => {
    // Réinitialiser à la page 1 quand on change le nombre d'éléments par page
    dispatch({ type: TASK_ACTIONS.SET_PAGINATION, payload: { 
      currentPage: 1, 
      itemsPerPage 
    } });
  };

  const clearError = () => {
    dispatch({ type: TASK_ACTIONS.CLEAR_ERROR });
  };

  // Les tâches sont maintenant directement celles retournées par le serveur (déjà filtrées et paginées)
  const filteredTasks = Array.isArray(state.tasks) ? state.tasks : [];

  const value = {
    ...state,
    filteredTasks,
    loadTasks,
    initializeTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    setFilters,
    changePage,
    changeItemsPerPage,
    clearError,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
});

// Hook personnalisé
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export default TaskContext;
