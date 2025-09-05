const testEvents = async () => {
  console.log('🔍 Test de l\'endpoint /events...');
  
  const url = 'http://localhost:3000/events';

  try {
    console.log('📤 Requête GET vers:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('📊 Status:', response.status);
    console.log('📊 Headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.text();
    console.log('📝 Réponse brute:', data.substring(0, 200) + '...');

    if (response.ok) {
      try {
        const jsonData = JSON.parse(data);
        console.log('✅ Events récupérés:', jsonData.length, 'événements');
        if (jsonData.length > 0) {
          console.log('📝 Premier événement:', jsonData[0]);
        }
      } catch (parseError) {
        console.log('✅ Réponse OK mais non-JSON:', data);
      }
    } else {
      console.log('❌ Échec:', data);
    }

  } catch (error) {
    console.error('💥 Erreur:', error.message);
  }
};

testEvents();
