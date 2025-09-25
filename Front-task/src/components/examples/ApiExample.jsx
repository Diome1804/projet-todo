import React, { useState, useEffect } from 'react';
import { taskService, authService, historyService } from '../../services';

const ApiExample = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Exemple d'utilisation des services API
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      setError('Erreur lors du chargement des tâches');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    try {
      const newTask = {
        lex_name: 'Nouvelle tâche',
        lex_description: 'Créée via l\'API',
        photoUrl: null
      };

      const created = await taskService.createTask(newTask);
      console.log('Tâche créée:', created);
      loadTasks(); // Recharger la liste
    } catch (err) {
      console.error('Erreur création:', err);
    }
  };

  const completeTask = async (taskId) => {
    try {
      await taskService.completeTask(taskId);
      loadTasks(); // Recharger la liste
    } catch (err) {
      console.error('Erreur completion:', err);
    }
  };

  const deleteTask = async (taskId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      try {
        await taskService.deleteTask(taskId);
        loadTasks(); // Recharger la liste
      } catch (err) {
        console.error('Erreur suppression:', err);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Exemple d'utilisation de l'API</h2>

      <div className="mb-4">
        <button
          onClick={createTask}
          className="bg-emerald-500 text-white px-4 py-2 rounded mr-2"
        >
          Créer une tâche
        </button>
        <button
          onClick={loadTasks}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {loading ? 'Chargement...' : 'Recharger'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded shadow">
        <h3 className="text-lg font-semibold p-4 border-b">
          Tâches ({tasks.length})
        </h3>

        {tasks.length === 0 ? (
          <p className="p-4 text-gray-500">Aucune tâche trouvée</p>
        ) : (
          <div className="divide-y">
            {tasks.map(task => (
              <div key={task.id} className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{task.lex_name}</h4>
                  <p className="text-gray-600 text-sm">{task.lex_description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => completeTask(task.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Terminer
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiExample;
