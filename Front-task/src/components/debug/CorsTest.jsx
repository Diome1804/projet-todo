import React, { useState } from 'react';
import { testCorsConnection, testPreflightRequest, diagnoseCorsIssues } from '../../utils/corsTest.js';

const CorsTest = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostic = async () => {
    setLoading(true);
    try {
      const diagnostic = await diagnoseCorsIssues();
      setResults(diagnostic);
    } catch (error) {
      setResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testSimpleRequest = async () => {
    setLoading(true);
    try {
      const result = await testCorsConnection();
      setResults({ simpleTest: result });
    } catch (error) {
      setResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🔧 Test de Connectivité CORS</h2>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={runDiagnostic}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Test en cours...' : '🔍 Diagnostic Complet'}
        </button>
        
        <button
          onClick={testSimpleRequest}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 ml-2"
        >
          {loading ? 'Test en cours...' : '🚀 Test Simple'}
        </button>
      </div>

      {results && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Résultats :</h3>
          <pre className="text-sm overflow-auto bg-white p-3 rounded border">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
        <h4 className="font-semibold text-yellow-800">Informations de Debug :</h4>
        <ul className="mt-2 text-sm text-yellow-700">
          <li><strong>Origin actuelle :</strong> {window.location.origin}</li>
          <li><strong>Backend URL :</strong> http://localhost:3000</li>
          <li><strong>Token présent :</strong> {localStorage.getItem('token') || localStorage.getItem('authToken') ? '✅ Oui' : '❌ Non'}</li>
        </ul>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400">
        <h4 className="font-semibold text-blue-800">Solutions possibles :</h4>
        <ul className="mt-2 text-sm text-blue-700 space-y-1">
          <li>• Vérifier que le backend tourne sur le port 3000</li>
          <li>• Vérifier que le frontend tourne sur un port autorisé (5173, 5174, 5175)</li>
          <li>• Vérifier la présence du token d'authentification</li>
          <li>• Redémarrer le backend après les modifications CORS</li>
        </ul>
      </div>
    </div>
  );
};

export default CorsTest;