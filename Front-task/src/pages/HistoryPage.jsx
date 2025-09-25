import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { historyService } from '../services/historyService';
import { taskService } from '../services/taskServiceUpdated';

const HistoryPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadHistory();
    }
  }, [isAuthenticated]);

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

  const loadHistory = async () => {
    try {
      setLoading(true);
      const historyData = await historyService.getHistory();
      setHistory(historyData);
    } catch (error) {
      setError('Erreur lors du chargement de l\'historique');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Accès non autorisé
          </h2>
          <p className="text-gray-600">
            Veuillez vous connecter pour voir l'historique.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Historique des tâches
          </h1>
          <p className="mt-2 text-gray-600">
            Consultez l'historique de toutes vos actions sur les tâches
          </p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-medium text-gray-900">
              Activités récentes
            </h2>
          </div>
          <div className="p-6">
            {loading ? (
              <p className="text-gray-500">Chargement de l'historique...</p>
            ) : error ? (
              <p className="text-red-500">Erreur: {error}</p>
            ) : history.length === 0 ? (
              <p className="text-gray-500">Aucune activité trouvée dans l'historique.</p>
            ) : (
              <div className="space-y-4">
                {history.map((entry, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        entry.action === 'created' ? 'bg-green-100 text-green-800' :
                        entry.action === 'updated' ? 'bg-emerald-100 text-emerald-800' :
                        entry.action === 'deleted' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {entry.action === 'created' ? 'C' :
                         entry.action === 'updated' ? 'U' :
                         entry.action === 'deleted' ? 'D' : 'A'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {entry.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(entry.timestamp).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
