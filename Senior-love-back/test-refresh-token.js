// Test de l'endpoint refresh-token
import fetch from 'node-fetch';

const BASE_URL = 'https://seniorlove.up.railway.app';

async function testRefreshToken() {
  try {
    console.log('🔄 Test de l\'endpoint /refresh-token...');
    
    // Test sans cookie (devrait retourner 401)
    const response = await fetch(`${BASE_URL}/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', data);
    
    if (response.status === 401) {
      console.log('✅ Endpoint existe et retourne bien 401 sans refresh token');
    } else {
      console.log('❌ Comportement inattendu');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testRefreshToken();
