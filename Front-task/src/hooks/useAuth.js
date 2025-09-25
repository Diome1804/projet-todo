import { useAuth as useAuthContext } from '../context/AuthContext.jsx';

// Hook pour l'authentification
export const useAuth = () => {
  return useAuthContext();
};

export default useAuth;
