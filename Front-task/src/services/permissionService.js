import apiClient from './apiClient';

export const permissionService = {
  // Donner des permissions à une tâche
  grantPermission: async (taskId, permissionData) => {
    try {
      const response = await apiClient.post(`/task/${taskId}/permissions`, permissionData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'octroi de permission:', error);
      throw error;
    }
  },

  // Révoquer des permissions d'une tâche
  revokePermission: async (taskId, userId) => {
    try {
      const response = await apiClient.delete(`/task/${taskId}/permissions/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la révocation de permission:', error);
      throw error;
    }
  },

  // Récupérer les permissions d'une tâche
  getTaskPermissions: async (taskId) => {
    try {
      const response = await apiClient.get(`/task/${taskId}/permissions`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des permissions:', error);
      throw error;
    }
  },

  // Vérifier les permissions d'un utilisateur sur une tâche
  checkUserPermission: async (taskId, userId) => {
    try {
      const response = await apiClient.get(`/task/${taskId}/permissions/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la vérification des permissions:', error);
      throw error;
    }
  },
};
