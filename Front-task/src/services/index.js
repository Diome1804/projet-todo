// Export de tous les services
export { authService } from './authService';
export { taskService } from './taskServiceUpdated';
export { historyService } from './historyService';
export { permissionService } from './permissionService';
export { uploadService } from './uploadService';

// Export de l'API client
export { default as apiClient } from './apiClient';

// Export de la configuration API
export { API_ENDPOINTS } from '../config/apiConfig';
export { default as API_BASE_URL } from '../config/apiConfig';
