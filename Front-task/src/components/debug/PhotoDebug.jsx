import React, { useState, useEffect } from 'react';
import { taskService } from '../../services/taskServiceUpdated.js';
import API_BASE_URL from '../../config/apiConfig.js';

const PhotoDebug = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const result = await taskService.getTasks(1, 10);
        console.log('📸 Debug Photos - Données reçues:', result);
        setTasks(result.tasks || []);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  if (loading) {
    return <div className="p-4">Chargement...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🔍 Debug Photos des Tâches</h2>
      
      <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400">
        <h4 className="font-semibold text-blue-800">Configuration :</h4>
        <p className="text-blue-700"><strong>API_BASE_URL:</strong> {API_BASE_URL}</p>
        <p className="text-blue-700"><strong>Nombre de tâches:</strong> {tasks.length}</p>
      </div>

      <div className="space-y-6">
        {tasks.map(task => (
          <div key={task.id} className="border rounded-lg p-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Informations de la tâche */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Tâche #{task.id}: {task.lex_name}</h3>
                <div className="text-sm space-y-1">
                  <p><strong>photoUrl:</strong> <code className="bg-gray-200 px-1 rounded">{task.photoUrl || 'null'}</code></p>
                  <p><strong>photo:</strong> <code className="bg-gray-200 px-1 rounded">{task.photo || 'null'}</code></p>
                  <p><strong>userId:</strong> {task.userId}</p>
                </div>
                
                {/* URL construite */}
                {task.photoUrl && (
                  <div className="mt-2">
                    <p className="text-sm"><strong>URL construite:</strong></p>
                    <code className="text-xs bg-yellow-100 p-1 rounded block break-all">
                      {task.photoUrl.startsWith('http') ? task.photoUrl : `${API_BASE_URL}${task.photoUrl}`}
                    </code>
                  </div>
                )}
              </div>

              {/* Aperçu de l'image */}
              <div>
                {task.photoUrl ? (
                  <div>
                    <p className="text-sm font-medium mb-2">Aperçu de l'image :</p>
                    <img
                      src={task.photoUrl.startsWith('http') ? task.photoUrl : `${API_BASE_URL}${task.photoUrl}`}
                      alt={`Photo de ${task.lex_name}`}
                      className="w-full h-32 object-cover rounded border"
                      onLoad={() => console.log(`✅ Image chargée pour tâche ${task.id}`)}
                      onError={(e) => {
                        console.log(`❌ Erreur image pour tâche ${task.id}:`, e.target.src);
                        e.target.style.border = '2px solid red';
                        e.target.alt = 'Erreur de chargement';
                      }}
                    />
                    
                    {/* Test direct de l'URL */}
                    <div className="mt-2">
                      <a 
                        href={task.photoUrl.startsWith('http') ? task.photoUrl : `${API_BASE_URL}${task.photoUrl}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        🔗 Ouvrir l'image dans un nouvel onglet
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 bg-gray-200 rounded border-2 border-dashed border-gray-400">
                    <span className="text-gray-500">Pas d'image</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucune tâche trouvée
        </div>
      )}
    </div>
  );
};

export default PhotoDebug;