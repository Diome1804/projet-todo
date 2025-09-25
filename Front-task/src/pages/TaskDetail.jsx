import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { taskService } from '../services/taskServiceUpdated';
import API_BASE_URL from '../config/apiConfig';
import Modal from '../components/ui/Modal.jsx';
import Button from '../components/ui/Button.jsx';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteTask, toggleTaskStatus } = useTasks();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Removed scroll disabling to allow scrolling for better button visibility

  useEffect(() => {
    const loadTask = async () => {
      try {
        setLoading(true);
        const taskData = await taskService.getTaskById(id);
        setTask(taskData);
      } catch (err) {
        setError('Erreur lors du chargement de la tâche');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTask();
  }, [id]);

  const handleEdit = () => {
    navigate(`/tasks/${id}/edit`);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setShowDeleteConfirm(false);
    try {
      await deleteTask(id);
      // Redirection vers la liste des tâches après suppression
      navigate('/tasks');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression de la tâche');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleToggleComplete = async () => {
    try {
      await toggleTaskStatus(id);
      // Recharger la tâche pour mettre à jour l'état
      const updatedTask = await taskService.getTaskById(id);
      setTask(updatedTask);
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      // TODO: Afficher un message d'erreur
    }
  };

  const activityLog = [
    { id: 1, action: 'Task created', time: '2 days ago' },
    { id: 2, action: "Status updated to 'In Progress'", time: '1 day ago' },
    { id: 3, action: 'Assigned to Sarah Miller', time: '1 day ago' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="mt-2 text-gray-600">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 font-sans">
        <div className="max-w-7xl mx-auto bg-white rounded shadow p-6">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 font-sans">
        <div className="max-w-7xl mx-auto bg-white rounded shadow p-6">
          <p className="text-gray-600">Task not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded shadow p-6 flex space-x-8">
        <div className="flex-1">
          {/* <h1 className="text-2xl font-bold mb-4">Task Details</h1> */}
          <p className="mb-6 text-gray-600">View and manage the details of this task.</p>
          <form className="space-y-6 pb-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={task.lex_name}
                readOnly
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={task.lex_description}
                readOnly
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                value={task.completed ? 'Completed' : 'Not Completed'}
                disabled
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              >
                <option>Completed</option>
                <option>Not Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attached Photo</label>
              {task.photoUrl ? (
                <img
                  src={task.photoUrl.startsWith('http') ? task.photoUrl : `${API_BASE_URL}${task.photoUrl}`}
                  alt="Attached"
                  className="rounded shadow max-w-full h-auto"
                />
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded p-8 text-center text-gray-500">
                  No photo attached
                </div>
              )}
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                type="button"
                onClick={handleEdit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Edit
              </button>
              <Button
                variant="danger"
                onClick={handleDeleteClick}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Suppression...
                  </div>
                ) : (
                  'Supprimer'
                )}
              </Button>
              <button
                type="button"
                onClick={handleToggleComplete}
                className="ml-auto px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
              >
                {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
              </button>
            </div>
          </form>
        </div>
        <div className="w-64 bg-gray-100 rounded p-4">
          <h2 className="text-lg font-semibold mb-4">Activity Log</h2>
          <ul className="space-y-3 text-sm text-gray-700">
            {activityLog.map((entry) => (
              <li key={entry.id} className="flex items-start space-x-2">
                <svg
                  className="h-5 w-5 text-gray-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p>{entry.action}</p>
                  <p className="text-xs text-gray-500">{entry.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={handleCancelDelete}
        title="Confirmer la suppression"
        size="sm"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: '#374151' }}>
            Êtes-vous sûr de vouloir supprimer la tâche <strong>"{task?.lex_name}"</strong> ?
          </p>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Cette action est irréversible et vous serez redirigé vers la liste des tâches.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              onClick={handleCancelDelete}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f3f4f6',
                color: '#111827',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            >
              Annuler
            </button>
            <button
              onClick={handleConfirmDelete}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: '1px solid transparent',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
            >
              Supprimer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TaskDetail;
