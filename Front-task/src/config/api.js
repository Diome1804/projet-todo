const API_BASE_URL = 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  // Authentification
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,

  // Tâches
  TASKS: `${API_BASE_URL}/tasks`,
  TASK_BY_ID: (id) => `${API_BASE_URL}/tasks/${id}`,

  // Historique
  HISTORY: `${API_BASE_URL}/history`,

  // Utilisateurs
  USERS: `${API_BASE_URL}/users`,
};

export default API_BASE_URL;
