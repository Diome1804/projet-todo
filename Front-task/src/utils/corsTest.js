// Utilitaire pour tester la connectivité CORS
export const testCorsConnection = async () => {
  try {
    console.log('🔍 Test de connectivité CORS...');
    
    // Test simple avec fetch
    const response = await fetch('http://localhost:3000/task', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('authToken') || 'test'}`
      },
      credentials: 'include'
    });
    
    console.log('✅ Statut de la réponse:', response.status);
    console.log('✅ Headers de la réponse:', [...response.headers.entries()]);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Données reçues:', data);
      return { success: true, data };
    } else {
      console.log('❌ Erreur HTTP:', response.status, response.statusText);
      return { success: false, error: `HTTP ${response.status}` };
    }
    
  } catch (error) {
    console.error('❌ Erreur CORS/Network:', error);
    return { success: false, error: error.message };
  }
};

// Test spécifique pour les requêtes OPTIONS (preflight)
export const testPreflightRequest = async () => {
  try {
    console.log('🔍 Test de requête preflight OPTIONS...');
    
    const response = await fetch('http://localhost:3000/task', {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type,Authorization'
      }
    });
    
    console.log('✅ Preflight status:', response.status);
    console.log('✅ CORS headers:', {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
      'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials')
    });
    
    return { success: response.ok, status: response.status };
    
  } catch (error) {
    console.error('❌ Erreur preflight:', error);
    return { success: false, error: error.message };
  }
};

// Fonction pour diagnostiquer les problèmes CORS
export const diagnoseCorsIssues = async () => {
  console.log('🔧 Diagnostic CORS complet...');
  console.log('📍 Origin actuelle:', window.location.origin);
  console.log('🔑 Token présent:', !!(localStorage.getItem('token') || localStorage.getItem('authToken')));
  
  const preflightResult = await testPreflightRequest();
  const connectionResult = await testCorsConnection();
  
  return {
    origin: window.location.origin,
    hasToken: !!(localStorage.getItem('token') || localStorage.getItem('authToken')),
    preflight: preflightResult,
    connection: connectionResult
  };
};