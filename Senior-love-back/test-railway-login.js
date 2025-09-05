const testRailwayLogin = async () => {
  console.log('🔍 Test de connexion sur Railway...');
  
  const url = 'https://seniorlove.up.railway.app/login';
  const credentials = {
    email: 'jean55@example.com',
    password: 'jeanpass'
  };

  try {
    console.log('📤 Envoi des données vers Railway:', credentials);
    console.log('🚀 URL:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    console.log('📊 Status:', response.status);
    console.log('📊 Headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.text();
    console.log('📝 Réponse brute:', data);

    if (response.ok) {
      try {
        const jsonData = JSON.parse(data);
        console.log('✅ Connexion Railway réussie:', jsonData);
        return jsonData.token;
      } catch (parseError) {
        console.log('✅ Connexion OK mais réponse non-JSON:', data);
      }
    } else {
      console.log('❌ Échec de connexion Railway:', data);
    }

  } catch (error) {
    console.error('💥 Erreur Railway:', error.message);
  }
  
  return null;
};

testRailwayLogin();
