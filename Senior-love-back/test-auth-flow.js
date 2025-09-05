const testEventsWithAuth = async () => {
  console.log('🔍 Test complet : login puis events...');
  
  // Étape 1: Login pour obtenir le token
  console.log('📤 Étape 1: Connexion...');
  const loginResponse = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'jean55@example.com',
      password: 'jeanpass'
    })
  });

  if (!loginResponse.ok) {
    console.log('❌ Échec de connexion');
    return;
  }

  const loginData = await loginResponse.json();
  console.log('✅ Connexion réussie, token reçu');
  const token = loginData.token;

  // Étape 2: Test de l'endpoint /events avec le token
  console.log('📤 Étape 2: Test /events avec authentification...');
  
  try {
    const eventsResponse = await fetch('http://localhost:3000/events', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('📊 Status /events:', eventsResponse.status);

    const eventsData = await eventsResponse.text();
    console.log('📝 Réponse /events:', eventsData.substring(0, 200) + '...');

    if (eventsResponse.ok) {
      try {
        const jsonData = JSON.parse(eventsData);
        console.log('✅ Events récupérés avec succès:', jsonData.length, 'événements');
        if (jsonData.length > 0) {
          console.log('📝 Premier événement:', jsonData[0].name);
        }
      } catch (parseError) {
        console.log('✅ Réponse OK mais non-JSON:', eventsData);
      }
    } else {
      console.log('❌ Échec /events:', eventsData);
    }

  } catch (error) {
    console.error('💥 Erreur:', error.message);
  }
};

testEventsWithAuth();
