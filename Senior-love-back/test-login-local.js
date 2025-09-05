const loginTest = async () => {
  console.log('🔍 Test de connexion locale...');
  
  const url = 'http://localhost:3000/login';
  const credentials = {
    email: 'jean55@example.com',
    password: 'jeanpass'
  };

  try {
    console.log('📤 Envoi des données:', credentials);
    
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
        console.log('✅ Connexion réussie:', jsonData);
      } catch (parseError) {
        console.log('✅ Connexion OK mais réponse non-JSON:', data);
      }
    } else {
      console.log('❌ Échec de connexion:', data);
    }

  } catch (error) {
    console.error('💥 Erreur:', error.message);
  }
};

loginTest();
