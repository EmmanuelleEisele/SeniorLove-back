import axios from 'axios';

async function testServer() {
    try {
        console.log('🔄 Test du serveur...');
        const response = await axios.get('http://localhost:3000/');
        console.log('✅ Serveur actif:', response.data);
    } catch (error) {
        console.log('❌ Serveur inaccessible:', error.message);
    }
}

testServer();
