import fetch from 'node-fetch';

async function testRailwayDatabase() {
    console.log('🔍 Test de l\'état de la base de données Railway...');
    
    try {
        const response = await fetch('https://seniorlove.up.railway.app/debug-db', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        console.log('📊 Status:', response.status);
        
        const responseData = await response.text();
        console.log('📝 Réponse:', responseData);
        
        if (response.ok) {
            console.log('✅ Base de données Railway accessible !');
        } else {
            console.log('❌ Problème avec la base de données Railway');
        }
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}

testRailwayDatabase();
