import apiClient from './apiClient';

export const historyService = {
  // Récupérer l'historique avec filtres
  getHistory: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.taskId) params.append('taskId', filters.taskId);
      if (filters.actorId) params.append('actorId', filters.actorId);
      if (filters.action) params.append('action', filters.action);
      if (filters.from) params.append('from', filters.from);
      if (filters.to) params.append('to', filters.to);
      if (filters.page) params.append('page', filters.page);
      if (filters.pageSize) params.append('pageSize', filters.pageSize);

      const response = await apiClient.get(`/history?${params}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      throw error;
    }
  },

  // Récupérer l'historique d'une tâche spécifique
  getTaskHistory: async (taskId) => {
    try {
      const response = await historyService.getHistory({ taskId });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique de la tâche:', error);
      throw error;
    }
  },

  // Récupérer l'historique d'un utilisateur
  getUserHistory: async (userId) => {
    try {
      const response = await historyService.getHistory({ actorId: userId });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique utilisateur:', error);
      throw error;
    }
  },
};
