import React, { useEffect, useState } from 'react';
import { useTasks } from '../hooks/useTasks.js';
import { useAuth } from '../context/AuthContext.jsx';
import { taskService } from '../services/taskServiceUpdated.js';
import { authService } from '../services/authService.js';

const PermissionsPage = () => {
  const { user } = useAuth();
  const { tasks, loading, error } = useTasks();
  const [users, setUsers] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [grantData, setGrantData] = useState({ granteeId: '', canEdit: false, canDelete: false });

  useEffect(() => {
    // Désactiver le scroll
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  // Charger les utilisateurs disponibles pour une tâche spécifique
  const loadAvailableUsers = async (taskId) => {
    try {
      const availableUsers = await taskService.getAvailableUsers(taskId);
      setUsers(availableUsers);
    } catch (err) {
      console.error('Erreur chargement utilisateurs disponibles:', err);
      setUsers([]);
    }
  };

  // Filtrer les tâches possédées par l'utilisateur
  const ownedTasks = tasks.filter(task => task.userId === user?.id);

  const handleGrantPermission = async () => {
    if (!selectedTask || !grantData.granteeId) return;

    try {
      await taskService.grantPermission(selectedTask.id, parseInt(grantData.granteeId), grantData.canEdit, grantData.canDelete);
      setShowGrantModal(false);
      setGrantData({ granteeId: '', canEdit: false, canDelete: false });
      // Recharger les tâches pour mettre à jour les permissions
      window.location.reload();
    } catch (err) {
      console.error('Erreur lors de l\'octroi des permissions:', err);
    }
  };

  const handleRevokePermission = async (taskId, granteeId) => {
    try {
      await taskService.revokePermission(taskId, granteeId);
      window.location.reload();
    } catch (err) {
      console.error('Erreur lors de la révocation des permissions:', err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Gestion des Permissions</h1>
        <p className="mb-6 text-gray-600">Gérez les permissions pour vos tâches.</p>

        {ownedTasks.length === 0 ? (
          <p className="text-gray-500">Vous n'avez aucune tâche à partager.</p>
        ) : (
          ownedTasks.map(task => (
            <div key={task.id} className="mb-8 p-4 border rounded">
              <h2 className="text-lg font-semibold mb-4">{task.lex_name}</h2>

              {/* Permissions existantes */}
              {task.permissions && task.permissions.length > 0 ? (
                <table className="w-full table-auto border-collapse mb-4">
                  <thead>
                    <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                      <th className="p-3 border-b border-gray-300">Utilisateur</th>
                      <th className="p-3 border-b border-gray-300">Peut modifier</th>
                      <th className="p-3 border-b border-gray-300">Peut supprimer</th>
                      <th className="p-3 border-b border-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {task.permissions.map(perm => {
                      const grantee = users.find(u => u.id === perm.granteeId);
                      return (
                        <tr key={perm.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-3">{grantee ? grantee.name : 'Utilisateur inconnu'}</td>
                          <td className="p-3">{perm.canEdit ? 'Oui' : 'Non'}</td>
                          <td className="p-3">{perm.canDelete ? 'Oui' : 'Non'}</td>
                          <td className="p-3">
                            <button
                              onClick={() => handleRevokePermission(task.id, perm.granteeId)}
                              className="text-red-600 underline hover:text-red-800"
                            >
                              Révoquer
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 mb-4">Aucune permission accordée pour cette tâche.</p>
              )}

              <button
                onClick={() => {
                  setSelectedTask(task);
                  loadAvailableUsers(task.id);
                  setShowGrantModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                + Accorder une permission
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal pour accorder des permissions */}
      {showGrantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Accorder des permissions</h2>
            <p className="mb-4">Pour la tâche: {selectedTask?.lex_name}</p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Utilisateur</label>
              <select
                value={grantData.granteeId}
                onChange={(e) => setGrantData({ ...grantData, granteeId: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Sélectionner un utilisateur</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={grantData.canEdit}
                  onChange={(e) => setGrantData({ ...grantData, canEdit: e.target.checked })}
                  className="mr-2"
                />
                Peut modifier
              </label>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={grantData.canDelete}
                  onChange={(e) => setGrantData({ ...grantData, canDelete: e.target.checked })}
                  className="mr-2"
                />
                Peut supprimer
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowGrantModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={handleGrantPermission}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Accorder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionsPage;
