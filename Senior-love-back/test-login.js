import axios from 'axios';

async function testLogin() {
    try {
        console.log('🔄 Test de connexion en cours...');
        const response = await axios.post('http://localhost:3000/login', {
            email: 'jean55@example.com',
            password: 'jeanpass'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Connexion réussie:', response.data);
    } catch (error) {
        console.log('❌ Erreur de connexion:');
        console.log('Message:', error.message);
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
        } else if (error.request) {
            console.log('Pas de réponse reçue:', error.request);
        } else {
            console.log('Erreur config:', error.message);
        }
    }
}

testLogin();
