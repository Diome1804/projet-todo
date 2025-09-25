import apiClient from './apiClient';

export const taskService = {
  // Récupérer toutes les tâches
  getTasks: async () => {
    try {
      const response = await apiClient.get('/tasks');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      throw error;
    }
  },

  // Créer une nouvelle tâche
  createTask: async (taskData) => {
    try {
      const response = await apiClient.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      throw error;
    }
  },

  // Mettre à jour une tâche
  updateTask: async (id, taskData) => {
    try {
      const response = await apiClient.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      throw error;
    }
  },

  // Supprimer une tâche
  deleteTask: async (id) => {
    try {
      const response = await apiClient.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      throw error;
    }
  },

  // Récupérer l'historique
  getTaskHistory: async () => {
    try {
      const response = await apiClient.get('/history');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      throw error;
    }
  },

  // Récupérer une tâche par son ID
  getTaskById: async (id) => {
    try {
      const response = await apiClient.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la tâche:', error);
      throw error;
    }
  },

  // Accorder des permissions
  grantPermission: async (taskId, granteeId, canEdit, canDelete) => {
    try {
      const response = await apiClient.post(`/tasks/${taskId}/permissions`, {
        granteeId,
        canEdit,
        canDelete,
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'octroi des permissions:', error);
      throw error;
    }
  },

  // Révoquer des permissions
  revokePermission: async (taskId, granteeId) => {
    try {
      const response = await apiClient.delete(`/tasks/${taskId}/permissions/${granteeId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la révocation des permissions:', error);
      throw error;
    }
  },
};
