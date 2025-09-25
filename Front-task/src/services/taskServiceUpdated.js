import apiClient from './apiClient';
import { uploadService } from './uploadService';
import { API_ENDPOINTS } from '../config/apiConfig';
import API_BASE_URL from '../config/apiConfig';

// Fonction utilitaire pour construire l'URL complète de la photo
const buildPhotoUrl = (photoPath) => {
  if (!photoPath) return null;
  
  // Si l'URL est déjà complète, la retourner telle quelle
  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    return photoPath;
  }
  
  // Si le chemin commence par /uploads, construire l'URL complète
  if (photoPath.startsWith('/uploads/')) {
    return `${API_BASE_URL}${photoPath}`;
  }
  
  // Si c'est juste le nom du fichier, ajouter le chemin complet
  if (!photoPath.startsWith('/')) {
    return `${API_BASE_URL}/uploads/${photoPath}`;
  }
  
  return `${API_BASE_URL}${photoPath}`;
};

export const taskService = {
  // Récupérer toutes les tâches avec pagination
  getTasks: async (page = 1, limit = 10, search = '', status = 'all') => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        status,
        t: new Date().getTime().toString() // Cache-busting
      });
      
      const url = `${API_ENDPOINTS.TASKS}?${params}`;
      console.log('Appel API pour les tâches :', url);
      console.log('Token avant appel :', localStorage.getItem('token') ? 'Présent' : 'Absent');
      
      const response = await apiClient.get(url);
      console.log('Réponse API :', response.data);
      
      const result = response.data;
      
      // Ensure photoUrl and audioUrl are set correctly for all tasks with full URL
      if (result.tasks && Array.isArray(result.tasks)) {
        result.tasks.forEach(task => {
          if (task.photoUrl) {
            task.photoUrl = buildPhotoUrl(task.photoUrl);
          }
          if (task.audioUrl) {
            task.audioUrl = buildPhotoUrl(task.audioUrl);
          }
        });
      }

      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      // Si le backend n'est pas disponible, retourner une structure vide
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
        console.log('Backend non disponible, retour d\'une structure vide');
        return {
          tasks: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: limit,
            hasNextPage: false,
            hasPrevPage: false
          }
        };
      }
      throw error;
    }
  },

  // Créer une nouvelle tâche
  createTask: async (taskData) => {
    try {
      // Récupérer l'utilisateur connecté
      const currentUser = JSON.parse(localStorage.getItem('user'));

      if (!currentUser) {
        throw new Error('Utilisateur non connecté');
      }

      // Préparer les données de la tâche
      const taskWithUserId = {
        ...taskData,
        userId: currentUser.id
      };

      // Si une photo ou un audio est inclus, utiliser FormData
      if (taskData.photo || taskData.audio) {
        const formData = new FormData();
        formData.append('lex_name', taskWithUserId.lex_name);
        formData.append('lex_description', taskWithUserId.lex_description || '');
        formData.append('completed', taskWithUserId.completed || false);
        formData.append('userId', taskWithUserId.userId);
        
        if (taskData.photo) {
          formData.append('photo', taskData.photo);
        }
        
        if (taskData.audio) {
          // Convertir le blob audio en fichier avec un nom
          const audioFile = new File([taskData.audio], `audio_${Date.now()}.webm`, {
            type: 'audio/webm;codecs=opus'
          });
          formData.append('audio', audioFile);
        }

        const response = await apiClient.post(API_ENDPOINTS.TASKS, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        // Ensure URLs are set correctly from the backend response
        let createdTask = response.data;
        if (createdTask.photoUrl) {
          createdTask.photoUrl = buildPhotoUrl(createdTask.photoUrl);
        }
        if (createdTask.audioUrl) {
          createdTask.audioUrl = buildPhotoUrl(createdTask.audioUrl); // Utilise la même fonction pour construire l'URL
        }
        return createdTask;
      } else {
        // Pas de fichiers, envoyer comme JSON
        const response = await apiClient.post(API_ENDPOINTS.TASKS, taskWithUserId);
        return response.data;
      }
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      throw error;
    }
  },

  // Mettre à jour une tâche
  updateTask: async (id, taskData) => {
    try {
      // Récupérer l'utilisateur connecté
      const currentUser = JSON.parse(localStorage.getItem('user'));

      if (!currentUser) {
        throw new Error('Utilisateur non connecté');
      }

      // Préparer les données de la tâche avec userId
      const taskWithUserId = {
        ...taskData,
        userId: currentUser.id
      };

      const response = await apiClient.put(API_ENDPOINTS.TASK_BY_ID(id), taskWithUserId);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      throw error;
    }
  },

  // Supprimer une tâche
  deleteTask: async (id) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.TASK_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      throw error;
    }
  },

  // Récupérer une tâche par son ID
  getTaskById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.TASK_BY_ID(id));
      const taskData = response.data;
      // Ensure photoUrl and audioUrl are set correctly with full URL
      if (taskData.photoUrl) {
        taskData.photoUrl = buildPhotoUrl(taskData.photoUrl);
      }
      if (taskData.audioUrl) {
        taskData.audioUrl = buildPhotoUrl(taskData.audioUrl);
      }
      return taskData;
    } catch (error) {
      console.error('Erreur lors de la récupération de la tâche:', error);
      throw error;
    }
  },

  // Marquer une tâche comme terminée
  completeTask: async (id) => {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.TASK_COMPLETE(id));
      return response.data;
    } catch (error) {
      console.error('Erreur lors du marquage de la tâche:', error);
      throw error;
    }
  },

  // Gestion des permissions
  grantPermission: async (taskId, granteeId, canEdit, canDelete) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.TASK_PERMISSIONS(taskId), {
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

  addPermission: async (taskId, permissionData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.TASK_PERMISSIONS(taskId), permissionData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de permission:', error);
      throw error;
    }
  },

  // Révoquer une permission
  revokePermission: async (taskId, userId) => {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.TASK_PERMISSIONS(taskId)}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la révocation de permission:', error);
      throw error;
    }
  },

  // Récupérer les utilisateurs disponibles pour accorder des permissions
  getAvailableUsers: async (taskId) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.TASK_BY_ID(taskId)}/available-users`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs disponibles:', error);
      throw error;
    }
  },

  // Upload de photo (utilise le service d'upload général)
  uploadPhoto: async (photoFile) => {
    try {
      const response = await uploadService.uploadFile(photoFile, 'tasks');
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'upload de la photo:', error);
      throw error;
    }
  },
};
