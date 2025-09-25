import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { taskService } from '../services/taskServiceUpdated';
import TaskForm from '../components/tasks/TaskForm';

const TaskFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { createTask, updateTask } = useTasks();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const isEditing = !!id;

  useEffect(() => {
    // Désactiver le scroll quand le composant est monté
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Réactiver le scroll quand le composant est démonté
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (isEditing) {
      const loadTask = async () => {
        try {
          setLoading(true);
          const taskData = await taskService.getTaskById(id);
          setTask(taskData);
        } catch (error) {
          console.error('Erreur lors du chargement de la tâche:', error);
          // TODO: Afficher un message d'erreur à l'utilisateur
        } finally {
          setLoading(false);
        }
      };
      loadTask();
    }
  }, [id, isEditing]);

  const handleSave = async (taskData) => {
    try {
      if (isEditing) {
        await updateTask(id, taskData);
        // Rediriger vers les détails de la tâche après la mise à jour
        navigate(`/tasks/${id}`);
      } else {
        await createTask(taskData);
        // Rediriger vers la liste des tâches après la création
        navigate('/tasks');
      }
    } catch (error) {
      console.error(`Erreur lors de ${isEditing ? 'la mise à jour' : 'la création'} de la tâche:`, error);
      // L'erreur sera affichée par le contexte TaskContext
    }
  };

  const handleCancel = () => {
    navigate('/tasks');
  };

  if (isEditing && loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-lg text-gray-600 font-medium">Chargement de la tâche...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TaskForm task={task} onSubmit={handleSave} onCancel={handleCancel} />
    </div>
  );
};

export default TaskFormPage;
