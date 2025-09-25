import apiClient from './apiClient';

export const uploadService = {
  // Upload d'une photo pour une tâche
  uploadTaskPhoto: async (taskId, photoFile) => {
    try {
      const formData = new FormData();
      formData.append('photo', photoFile);

      const response = await apiClient.post(`/task/${taskId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'upload de la photo:', error);
      throw error;
    }
  },

  // Upload d'un fichier général
  uploadFile: async (file, folder = 'general') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Retourner l'URL du fichier uploadé
      return {
        fileUrl: response.data.fileUrl || response.data.url,
        filename: response.data.filename,
        success: true
      };
    } catch (error) {
      console.error('Erreur lors de l\'upload du fichier:', error);
      throw error;
    }
  },

  // Récupérer l'URL d'un fichier uploadé
  getFileUrl: (filename) => {
    return `http://localhost:3000/uploads/${filename}`;
  },
};
