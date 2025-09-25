// Use backend URL directly
const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Authentification
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY: '/auth/verify',

  // Tâches
  TASKS: '/task',
  TASK_BY_ID: (id) => `/task/${id}`,
  TASK_COMPLETE: (id) => `/task/${id}/completed`,

  // Permissions
  TASK_PERMISSIONS: (id) => `/task/${id}/permissions`,

  // Historique
  HISTORY: '/history',

  // Uploads
  UPLOADS: '/uploads',
  UPLOAD: '/upload',
  TASK_UPLOAD: (id) => `/task/${id}/upload`,
};

export default API_BASE_URL;
