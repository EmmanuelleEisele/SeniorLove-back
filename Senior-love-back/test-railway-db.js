import { Sequelize } from 'sequelize';

const RAILWAY_DB_URL = 'postgresql://postgres:NseCQCLBKEvGtmlMRlHHFMBxxLiVqGWn@ballast.proxy.rlwy.net:29692/railway';

async function testRailwayDatabase() {
    console.log('🔍 Test de connexion directe à la base de données Railway...');
    
    const sequelize = new Sequelize(RAILWAY_DB_URL, {
        dialect: 'postgres',
        logging: false
    });

    try {
        await sequelize.authenticate();
        console.log('✅ Connexion à la base de données Railway réussie !');
        
        // Test pour récupérer les utilisateurs
        const [results] = await sequelize.query('SELECT email, first_name FROM "User" LIMIT 5');
        console.log('👥 Utilisateurs trouvés:', results);
        
        await sequelize.close();
        return true;
    } catch (error) {
        console.error('❌ Erreur de connexion à la base de données Railway:', error.message);
        return false;
    }
}

testRailwayDatabase();
