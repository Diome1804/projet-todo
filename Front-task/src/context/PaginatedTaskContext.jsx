import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { taskService } from '../services/taskServiceUpdated.js';

// État initial
const initialState = {
  tasks: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 5,
    hasNextPage: false,
    hasPrevPage: false
  },
  filters: {
    status: 'all',
    search: '',
  }
};

// Actions
const TASK_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_TASKS_DATA: 'SET_TASKS_DATA',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION'
};

// Reducer
const taskReducer = (state, action) => {
  switch (action.type) {
    case TASK_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case TASK_ACTIONS.SET_TASKS_DATA:
      return { 
        ...state, 
        tasks: action.payload.tasks,
        pagination: action.payload.pagination,
        loading: false, 
        error: null 
      };

    case TASK_ACTIONS.ADD_TASK:
      // Ajouter la nouvelle tâche au début de la liste
      return { 
        ...state, 
        tasks: [action.payload, ...state.tasks.slice(0, state.pagination.itemsPerPage - 1)],
        pagination: {
          ...state.pagination,
          totalItems: state.pagination.totalItems + 1
        }
      };

    case TASK_ACTIONS.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        ),
      };

    case TASK_ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        pagination: {
          ...state.pagination,
          totalItems: Math.max(0, state.pagination.totalItems - 1)
        }
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
const PaginatedTaskContext = createContext();

// Provider
export const PaginatedTaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Récupérer les paramètres depuis l'URL
  const getUrlParams = useCallback(() => {
    return {
      page: parseInt(searchParams.get('page')) || 1,
      limit: parseInt(searchParams.get('limit')) || 5,
      search: searchParams.get('search') || '',
      status: searchParams.get('status') || 'all'
    };
  }, [searchParams]);

  // Mettre à jour l'URL avec les nouveaux paramètres
  const updateUrl = useCallback((params) => {
    const newParams = new URLSearchParams();
    
    if (params.page && params.page > 1) {
      newParams.set('page', params.page.toString());
    }
    if (params.limit && params.limit !== 5) {
      newParams.set('limit', params.limit.toString());
    }
    if (params.search) {
      newParams.set('search', params.search);
    }
    if (params.status && params.status !== 'all') {
      newParams.set('status', params.status);
    }

    setSearchParams(newParams);
  }, [setSearchParams]);

  // Charger les tâches
  const loadTasks = useCallback(async (params = null) => {
    try {
      dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
      
      const urlParams = params || getUrlParams();
      const result = await taskService.getTasks(
        urlParams.page,
        urlParams.limit,
        urlParams.search,
        urlParams.status
      );
      
      dispatch({ type: TASK_ACTIONS.SET_TASKS_DATA, payload: result });
      
      // Mettre à jour les filtres dans l'état
      dispatch({ 
        type: TASK_ACTIONS.SET_FILTERS, 
        payload: { 
          search: urlParams.search, 
          status: urlParams.status 
        } 
      });
      
    } catch (error) {
      dispatch({
        type: TASK_ACTIONS.SET_ERROR,
        payload: error.response?.data?.message || 'Erreur lors du chargement des tâches',
      });
    }
  }, [getUrlParams]);

  // Charger les tâches quand les paramètres URL changent
  useEffect(() => {
    loadTasks();
  }, [searchParams, loadTasks]);

  // Actions
  const goToPage = useCallback((page) => {
    const params = getUrlParams();
    updateUrl({ ...params, page });
  }, [getUrlParams, updateUrl]);

  const changeItemsPerPage = useCallback((limit) => {
    const params = getUrlParams();
    updateUrl({ ...params, limit, page: 1 }); // Reset à la page 1
  }, [getUrlParams, updateUrl]);

  const setSearch = useCallback((search) => {
    const params = getUrlParams();
    updateUrl({ ...params, search, page: 1 }); // Reset à la page 1
  }, [getUrlParams, updateUrl]);

  const setStatus = useCallback((status) => {
    const params = getUrlParams();
    updateUrl({ ...params, status, page: 1 }); // Reset à la page 1
  }, [getUrlParams, updateUrl]);

  const createTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
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
      
      // Si la page actuelle n'a plus de tâches, aller à la page précédente
      if (state.tasks.length === 1 && state.pagination.currentPage > 1) {
        goToPage(state.pagination.currentPage - 1);
      } else {
        // Recharger la page actuelle pour mettre à jour la pagination
        loadTasks();
      }
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

  const clearError = () => {
    dispatch({ type: TASK_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    // Actions de pagination
    goToPage,
    changeItemsPerPage,
    setSearch,
    setStatus,
    // Actions CRUD
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    clearError,
    // Paramètres URL actuels
    urlParams: getUrlParams()
  };

  return <PaginatedTaskContext.Provider value={value}>{children}</PaginatedTaskContext.Provider>;
};

// Hook personnalisé
export const usePaginatedTasks = () => {
  const context = useContext(PaginatedTaskContext);
  if (!context) {
    throw new Error('usePaginatedTasks must be used within a PaginatedTaskProvider');
  }
  return context;
};

export default PaginatedTaskContext;