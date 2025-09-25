import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/index.js';
import Modal from '../ui/Modal.jsx';
import { useTasks } from '../../hooks/useTasks.js';
import { useAuth } from '../../context/AuthContext.jsx';
import API_BASE_URL from '../../config/apiConfig.js';

const TaskCard = ({ task }) => {
  const navigate = useNavigate();
  const { toggleTaskStatus, deleteTask } = useTasks();
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Check permissions
  const isOwner = task.userId === user?.id;
  const userPermissions = task.permissions?.[0] || {};
  const canEdit = isOwner || userPermissions.canEdit;
  const canDelete = isOwner || userPermissions.canDelete;

  const handleToggleStatus = async () => {
    try {
      await toggleTaskStatus(task.id);
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setShowDeleteConfirm(false);
    try {
      await deleteTask(task.id);
      // Success - task will be removed from state automatically
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      // Error is handled by the context and will show in UI
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on buttons
    if (e.target.closest('button')) {
      return;
    }
    navigate(`/tasks/${task.id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-100 card hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={handleCardClick}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={canEdit ? handleToggleStatus : undefined}
              disabled={!canEdit}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                task.completed
                  ? 'bg-green-500 border-green-500'
                  : canEdit ? 'border-gray-300 hover:border-emerald-500' : 'border-gray-300 opacity-50 cursor-not-allowed'
              }`}
            >
              {task.completed && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <h3 className={`font-semibold text-lg ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.lex_name}
            </h3>
          </div>

          {task.lex_description && (
            <p className={`text-gray-600 mb-3 ${task.completed ? 'line-through' : ''}`}>
              {task.lex_description}
            </p>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Créée le {formatDate(task.createdAt)}</span>
            {task.completed && task.completedAt && (
              <span className="text-green-600">
                Terminée le {formatDate(task.completedAt)}
              </span>
            )}
          </div>

          {/* Photo Display */}
          {(task.photoUrl || task.photo) && (
            <div className="mt-3">
              <img
                src={
                  task.photoUrl 
                    ? (task.photoUrl.startsWith('http') ? task.photoUrl : `${API_BASE_URL}${task.photoUrl}`)
                    : task.photo
                    ? (task.photo.startsWith('http') ? task.photo : `${API_BASE_URL}${task.photo}`)
                    : ''
                }
                alt="Task photo"
                className="w-full h-32 object-cover rounded-md"
                onError={(e) => {
                  console.log('Erreur de chargement image:', {
                    taskId: task.id,
                    photoUrl: task.photoUrl,
                    photo: task.photo,
                    src: e.target.src
                  });
                  e.target.style.display = 'none';
                }}
                onLoad={() => {
                  console.log('Image chargée avec succès:', {
                    taskId: task.id,
                    photoUrl: task.photoUrl,
                    photo: task.photo
                  });
                }}
              />
            </div>
          )}
        </div>

        <div className="flex gap-2 ml-4">
          {canEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/tasks/${task.id}/edit`)}
            >
              Modifier
            </Button>
          )}
          {canDelete && (
            <Button
              variant="danger"
              size="sm"
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
          )}
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
            Êtes-vous sûr de vouloir supprimer la tâche <strong>"{task.lex_name}"</strong> ?
          </p>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Cette action est irréversible.
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

export default TaskCard;
