import { useTasks as useTasksContext } from '../context/TaskContext.jsx';

// Hook pour les tâches
export const useTasks = () => {
  return useTasksContext();
};

export default useTasks;
