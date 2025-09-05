import fetch from 'node-fetch';

async function testLocalLogin() {
    console.log('🔍 Test de connexion sur le serveur local...');
    
    const loginData = {
        email: 'jean55@example.com',
        password: 'jeanpass'
    };
    
    console.log('📤 Envoi des données:', loginData);
    
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });
        
        console.log('📊 Status:', response.status);
        console.log('📊 Headers:', Object.fromEntries(response.headers.entries()));
        
        const responseData = await response.text();
        console.log('📝 Réponse brute:', responseData);
        
        if (response.ok) {
            console.log('✅ Connexion locale réussie !');
            return JSON.parse(responseData);
        } else {
            console.log('❌ Échec de connexion locale:', responseData);
        }
    } catch (error) {
        console.error('❌ Erreur de connexion locale:', error.message);
    }
}

testLocalLogin();
