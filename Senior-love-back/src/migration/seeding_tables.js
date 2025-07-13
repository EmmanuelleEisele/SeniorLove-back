import { Activity, User, Event, Category, Localisation, Conversation } from "../models/association.js";
import argon2 from "argon2"; // Import d'argon2

const initialInterets = {
    Loisirs: {
        "Atelier tricot": false,
        "Peinture sur soie": false,
        Scrapbooking: false,
        Lecture: false,
        Peinture: false,
        "Création bijoux": false,
        Photographie: false,
        Poterie: false,
        Cuisine: false,
    },
    Culture: {
        "Visite de musée": false,
        "Conférence historique": false,
        "Projection de film ancien": false,
        Cinéma: false,
        Théâtre: false,
    },
    Sport: {
        "Gym douce": false,
        Aquagym: false,
        Randonnée: false,
        "Marche rapide": false,
        Danse: false,
        Vélo: false,
    },
    "Bien-être": {
        "Séance de relaxation": false,
        "Massage assis": false,
        Yoga: false,
        Pilate: false,
        Sophrologie: false,
        "Cures thermales": false,
    },
    "Style de vie": {
        Voyage: false,
        "Proche de ma famille": false,
        "Vie simple": false,
        "A la recherche de l'amour": false,
        "Sorties entre amis": false,
        Bénévolat: false,
        Curieux: false,
    },
    Jeux: {
        "Tournoi de belote": false,
        Scrabble: false,
        Bingo: false,
        Bridge: false,
        "Mots croisés": false,
        Sudoku: false,
        Puzzles: false,
    },
    Musique: {
        Chorale: false,
        Classique: false,
        Jazz: false,
        Rock: false,
    },
    Nature: {
        "Balade au parc": false,
        Jardinage: false,
        "Visite de parcs naturels": false,
        "Amoureux des animaux": false,
    },
};

console.log("🔄 SeniorLoveBase seeding started...");

// Fonction utilitaire pour hasher un mot de passe avec argon2
const hashPassword = async (password) => await argon2.hash(password);

// biome-ignore lint/style/useConst: <explanation>
let jeanActivity = initialInterets;
jeanActivity["Loisirs"]["Lecture"] = true;
jeanActivity["Loisirs"]["Peinture"] = true;
jeanActivity["Loisirs"]["Création bijoux"] = true;

await User.bulkCreate([
    {
        pseudo: "jean55",
        email: "jean55@example.com",
        firstname: "Jean",
        lastname: "Lemoine",
        password: await hashPassword("jeanpass"),
        birth_date: "1965-02-15",
        gender: "homme",
        profile_picture: "/avatar/papi-nature.jpg",
        description: "J'aime la nature, les balades à vélo et les bons repas.",
        role: "user",
        interest: jeanActivity,
    },
    {
        pseudo: "marie62",
        email: "marie62@example.com",
        firstname: "Marie",
        lastname: "Dupont",
        password: await hashPassword("mariepass"),
        birth_date: "1958-07-21",
        gender: "femme",
        profile_picture: "/avatar/mamie_joie.jpg",
        description: "Amoureuse de la lecture, du jardinage et des chats 🐱.",
        role: "user",
        interest: initialInterets,
    },
    {
        pseudo: "paul77",
        email: "paul77@example.com",
        firstname: "Paul",
        lastname: "Giraud",
        password: await hashPassword("paulpass"),
        birth_date: "1948-03-10",
        gender: "homme",
        profile_picture: "/avatar/pepe-canne.jpg",
        description: "Retraité actif, je cherche une compagne pour partager des voyages et des moments conviviaux.",
        role: "user",
        interest: initialInterets,
    },
    {
        pseudo: "claudine60",
        email: "claudine60@example.com",
        firstname: "Claudine",
        lastname: "Rousseau",
        password: await hashPassword("claudinepass"),
        birth_date: "1960-11-05",
        gender: "femme",
        profile_picture: "/avatar/mamie-gourmande.jpg",
        description: "Passionnée de peinture et de cuisine, je cherche quelqu'un pour discuter et partager.",
        role: "user",
        interest: initialInterets,
    },
    {
        pseudo: "jeanluc64",
        email: "jeanluc64@example.com",
        firstname: "Jean-Luc",
        lastname: "Berger",
        password: await hashPassword("jeanlucpass"),
        birth_date: "1957-09-22",
        gender: "homme",
        profile_picture: "/avatar/al-capone.jpg",
        description: "Un amoureux des grands espaces et de la randonnée. Je cherche une partenaire pour profiter de la vie.",
        role: "user",
        interest: initialInterets,
    },
    {
        pseudo: "monique68",
        email: "monique68@example.com",
        firstname: "Monique",
        lastname: "Fournier",
        password: await hashPassword("moniquepass"),
        birth_date: "1955-05-11",
        gender: "femme",
        profile_picture: "/avatar/mamie-hippy.jpg",
        description: "Veuve depuis quelques années, je cherche à rencontrer quelqu'un pour partager des moments de joie.",
        role: "user",
        interest: initialInterets,
    },
    {
        pseudo: "georges71",
        email: "georges71@example.com",
        firstname: "Georges",
        lastname: "Lemoine",
        password: await hashPassword("georgespass"),
        birth_date: "1953-01-30",
        gender: "homme",
        profile_picture: "/avatar/papi-fatigue.jpg",
        description: "Ancien ingénieur, je suis passionné de musique classique et de voyages.",
        role: "user",
        interest: initialInterets,
    },
    {
        pseudo: "bernadette66",
        email: "bernadette66@example.com",
        firstname: "Bernadette",
        lastname: "Martin",
        password: await hashPassword("bernadettepass"),
        birth_date: "1964-08-18",
        gender: "femme",
        profile_picture: "/avatar/mamie-velo.jpg",
        description: "J'aime la photographie, la danse et passer du temps avec mes amis.",
        role: "user",
        interest: initialInterets,
    },
    {
        pseudo: "alain69",
        email: "alain69@example.com",
        firstname: "Alain",
        lastname: "Richard",
        password: await hashPassword("alainpass"),
        birth_date: "1952-10-25",
        gender: "homme",
        profile_picture: "/avatar/papi-80.jpg",
        description: "Amateur de bonne cuisine et de films anciens, je cherche une personne simple et joyeuse.",
        role: "user",
        interest: initialInterets,
    },
    {
        pseudo: "pierrette59",
        email: "pierrette59@example.com",
        firstname: "Pierrette",
        lastname: "Lefevre",
        password: await hashPassword("pierrettepass"),
        birth_date: "1966-06-12",
        gender: "femme",
        profile_picture: "/avatar/mamie-canne.jpg",
        description: "J'adore les promenades en bord de mer et la lecture de romans d'amour.",
        role: "user",
        interest: initialInterets,
    },
    {
        pseudo: "marineAdmin",
        email: "marine.admin@example.com",
        firstname: "Marine",
        lastname: "Ligny",
        password: await hashPassword("marineAdmin"),
        birth_date: "1990-09-13",
        gender: "femme",
        profile_picture: "",
        description: "Je suis ton pire ennemi, ici l'attaque des Tyrans !",
        role: "admin",
        interest: initialInterets,
    },
]);
console.log("✅ 10 utilisateurs sénior insérés avec succès");

// ici on insère les catégories
await Category.bulkCreate([{ name: "Loisirs" }, { name: "Culture" }, { name: "Sport" }, { name: "Bien-être" }, { name: "Style de vie" }, { name: "Jeux" }, { name: "Musique" }, { name: "Nature" }], { returning: true });
console.log("✅ 10 catégories insérés avec succès");

// ici on insère les activités
await Activity.bulkCreate([
    { name: "Atelier tricot" },
    { name: "Peinture sur soie" },
    { name: "Scrapbooking" },
    { name: "Lecture" },
    { name: "Peinture" },
    { name: "Création bijoux" },
    { name: "Photographie" },
    { name: "Poterie" },
    { name: "Cuisine" },
    { name: "Visite de musée" },
    { name: "Conférence historique" },
    { name: "Projection de film ancien" },
    { name: "Cinéma" },
    { name: "Théâtre" },
    { name: "Gym douce" },
    { name: "Aquagym" },
    { name: "Randonnée" },
    { name: "Marche rapide" },
    { name: "Danse" },
    { name: "Vélo" },
    { name: "Séance de relaxation" },
    { name: "Massage assis" },
    { name: "Yoga" },
    { name: "Pilate" },
    { name: "Sophrologie" },
    { name: "Cures thermales" },
    { name: "Voyage" },
    { name: "Proche de ma famille" },
    { name: "Vie simple" },
    { name: "A la recherche de l'amour" },
    { name: "Sorties entre amis" },
    { name: "Bénévolat" },
    { name: "Curieux" },
    { name: "Tournoi de belote" },
    { name: "Scrabble" },
    { name: "Bingo" },
    { name: "Bridge" },
    { name: "Mots croisés" },
    { name: "Sudoku" },
    { name: "Puzzles" },
    { name: "Chorale" },
    { name: "Classique" },
    { name: "Jazz" },
    { name: "Rock" },
    { name: "Balade au parc" },
    { name: "Jardinage" },
    { name: "Visite de parcs naturels" },
    { name: "Amoureux des animaux" },
]);
console.log("✅ Activités insérées avec succès");

//fonction pour paramétrer la creation des activités et leur lien avec une catégorie
async function addActivityToCategory(activityName, categoryName) {
    const activity = await Activity.findOne({ where: { name: activityName } });
    const category = await Category.findOne({ where: { name: categoryName } });

    if (!activity || !category) {
        throw new Error("Activity or Category not found");
    }

    // Associer l'activité à la catégorie
    activity.category_id = category.id; // Met à jour la clé étrangère category_id
    await activity.save(); // Sauvegarde l'activité avec la nouvelle catégorie
}

// Ajout d'activités aux catégories
await addActivityToCategory("Atelier tricot", "Loisirs");
await addActivityToCategory("Peinture sur soie", "Loisirs");
await addActivityToCategory("Scrapbooking", "Loisirs");
await addActivityToCategory("Lecture", "Loisirs");
await addActivityToCategory("Peinture", "Loisirs");
await addActivityToCategory("Création bijoux", "Loisirs");
await addActivityToCategory("Photographie", "Loisirs");
await addActivityToCategory("Poterie", "Loisirs");
await addActivityToCategory("Cuisine", "Loisirs");

await addActivityToCategory("Visite de musée", "Culture");
await addActivityToCategory("Conférence historique", "Culture");
await addActivityToCategory("Projection de film ancien", "Culture");
await addActivityToCategory("Cinéma", "Culture");
await addActivityToCategory("Théâtre", "Culture");

await addActivityToCategory("Gym douce", "Sport");
await addActivityToCategory("Aquagym", "Sport");
await addActivityToCategory("Randonnée", "Sport");
await addActivityToCategory("Marche rapide", "Sport");
await addActivityToCategory("Danse", "Sport");
await addActivityToCategory("Vélo", "Sport");

await addActivityToCategory("Séance de relaxation", "Bien-être");
await addActivityToCategory("Massage assis", "Bien-être");
await addActivityToCategory("Yoga", "Bien-être");
await addActivityToCategory("Pilate", "Bien-être");
await addActivityToCategory("Sophrologie", "Bien-être");
await addActivityToCategory("Cures thermales", "Bien-être");

await addActivityToCategory("Voyage", "Style de vie");
await addActivityToCategory("Proche de ma famille", "Style de vie");
await addActivityToCategory("Vie simple", "Style de vie");
await addActivityToCategory("A la recherche de l'amour", "Style de vie");
await addActivityToCategory("Sorties entre amis", "Style de vie");
await addActivityToCategory("Bénévolat", "Style de vie");
await addActivityToCategory("Curieux", "Style de vie");

await addActivityToCategory("Tournoi de belote", "Jeux");
await addActivityToCategory("Scrabble", "Jeux");
await addActivityToCategory("Bingo", "Jeux");
await addActivityToCategory("Bridge", "Jeux");
await addActivityToCategory("Mots croisés", "Jeux");
await addActivityToCategory("Sudoku", "Jeux");
await addActivityToCategory("Puzzles", "Jeux");

await addActivityToCategory("Chorale", "Musique");
await addActivityToCategory("Classique", "Musique");
await addActivityToCategory("Jazz", "Musique");
await addActivityToCategory("Rock", "Musique");

await addActivityToCategory("Balade au parc", "Nature");
await addActivityToCategory("Jardinage", "Nature");
await addActivityToCategory("Visite de parcs naturels", "Nature");
await addActivityToCategory("Amoureux des animaux", "Nature");

console.log("✅ Activités insérées avec succès");

// Création des événements fictifs
const events = [
    {
        name: "Café Rencontre et Discussions",
        date: "2025-05-05",
        description: "Rencontre conviviale autour d'un café pour discuter de vos passions et de vos expériences de vie.",
        picture: "https://images.pexels.com/photos/8790891/pexels-photo-8790891.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
        name: "Soirée dansante rétro",
        date: "2025-06-01",
        description: "Une soirée dansante avec des musiques des années 60 et 70. Viens bouger et retrouver tes souvenirs !",
        picture: "https://images.pexels.com/photos/6173849/pexels-photo-6173849.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
        name: "Randonnée douce en forêt",
        date: "2025-05-15",
        description: "Promenade tranquille en forêt pour profiter du plein air et échanger avec de nouveaux amis.",
        availability: 25,
        picture: "https://images.pexels.com/photos/31798073/pexels-photo-31798073/free-photo-of-vue-panoramique-sur-les-montagnes-des-pyrenees-francaises.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
        name: "Atelier Cuisine et Partage",
        date: "2025-07-10",
        description: "Préparez des recettes simples et savoureuses à partager, tout en rencontrant d'autres passionnés de cuisine.",
        availability: 16,
        picture: "https://images.pexels.com/photos/1655329/pexels-photo-1655329.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        name: "Soirée cinéma et discussion",
        date: "2025-08-20",
        description: "Projection d'un film classique suivi d'une discussion autour du cinéma. Un moment culturel et chaleureux.",
        availability: 10,
        picture: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
];
// Insérer les événements dans la base de données
await Event.bulkCreate(events);
console.log("✅ 5 événements créés avec succès");

// Fonction pour ajouter une activité à un événement
async function addActivityToEvent(eventName, activityName) {
    const event = await Event.findOne({ where: { name: eventName } });
    const activity = await Activity.findOne({ where: { name: activityName } });

    if (!event || !activity) {
        throw new Error("Event or Activity not found");
    }

    await event.addActivity(activity); // Associe l'activité à l'événement
}

// Association d'évènements aux activités
await addActivityToEvent("Café Rencontre et Discussions", "Lecture");
await addActivityToEvent("Soirée dansante rétro", "Danse");
await addActivityToEvent("Randonnée douce en forêt", "Marche rapide");
await addActivityToEvent("Randonnée douce en forêt", "Randonnée");
await addActivityToEvent("Soirée cinéma et discussion", "Cinéma");
await addActivityToEvent("Soirée cinéma et discussion", "Sorties entre amis");
await addActivityToEvent("Atelier Cuisine et Partage", "Cuisine");

console.log("✅ Activités ajoutées aux événements");

// Fonction pour ajouter un user à un événement
async function addUserToEvent(userPseudo, eventName) {
    const event = await Event.findOne({ where: { name: eventName } });
    const user = await User.findOne({ where: { pseudo: userPseudo } });

    if (!event || !user) {
        throw new Error("Event or User not found");
    }

    await event.addUser(user); // Associe l'utilisateur à l'événement
}

// Association d'utilisateurs aux évènements

await addUserToEvent("pierrette59", "Café Rencontre et Discussions");
await addUserToEvent("bernadette66", "Soirée dansante rétro");
await addUserToEvent("jeanluc64", "Randonnée douce en forêt");
await addUserToEvent("alain69", "Atelier Cuisine et Partage");
await addUserToEvent("claudine60", "Atelier Cuisine et Partage");

console.log("✅ Utilisateurs ajoutés aux événements");

// Fonction pour ajouter un utilisateur à une activité
async function addActivityToUser(userPseudo, activityName) {
    const activity = await Activity.findOne({ where: { name: activityName } });
    const user = await User.findOne({ where: { pseudo: userPseudo } });

    if (!activity || !user) {
        throw new Error("Activity or User not found");
    }

    await activity.addUser(user); // Associe l'utilisateur à une activité
}

// Association d'utilisateurs aux activités
// await addActivityToUser("jean55", "Vélo");
// await addActivityToUser("jean55", "Sorties entre amis");
// await addActivityToUser("jean55", "Balade au parc");

// await addActivityToUser("marie62", "Lecture");
// await addActivityToUser("marie62", "Jardinage");
// await addActivityToUser("marie62", "Amoureux des animaux");

// await addActivityToUser("paul77", "A la recherche de l'amour");
// await addActivityToUser("paul77", "Voyage");
// await addActivityToUser("paul77", "Tournoi de belote");

// await addActivityToUser("claudine60", "Peinture");
// await addActivityToUser("claudine60", "Cuisine");
// await addActivityToUser("claudine60", "Classique");

// await addActivityToUser("jeanluc64", "Randonnée");
// await addActivityToUser("jeanluc64", "Visite de parcs naturels");
// await addActivityToUser("jeanluc64", "A la recherche de l'amour");

// await addActivityToUser("monique68", "A la recherche de l'amour");
// await addActivityToUser("monique68", "Cures thermales");
// await addActivityToUser("monique68", "Peinture sur soie");

// await addActivityToUser("georges71", "Classique");
// await addActivityToUser("georges71", "Voyage");
// await addActivityToUser("georges71", "Projection de film ancien");

// await addActivityToUser("bernadette66", "Sorties entre amis");
// await addActivityToUser("bernadette66", "Danse");
// await addActivityToUser("bernadette66", "Photographie");

// await addActivityToUser("pierrette59", "Lecture");
// await addActivityToUser("pierrette59", "Visite de parcs naturels");
// await addActivityToUser("pierrette59", "Cinéma");

// await addActivityToUser("alain69", "Cuisine");
// await addActivityToUser("alain69", "Projection de film ancien");
// await addActivityToUser("alain69", "Jazz");

console.log("✅ Activités ajoutées aux utilisateurs");

// Fonction pour ajouter une localisation à un utilisateur avec un département
async function addLocalisationToUser(userPseudo, localisationName, department) {
    // Vérifier si la localisation avec le département existe déjà
    let localisation = await Localisation.findOne({
        where: {
            city: localisationName,
            department: department,
        },
    });

    // Si la localisation n'existe pas, créer une nouvelle localisation
    if (!localisation) {
        localisation = await Localisation.create({
            city: localisationName,
            department: department,
        });
    }

    // Récupérer l'utilisateur
    const user = await User.findOne({ where: { pseudo: userPseudo } });

    // Vérifier si l'utilisateur existe
    if (!user) {
        throw new Error("User not found");
    }

    // Associer l'utilisateur à la localisation
    await user.setLocalisation(localisation);
}

// Exemple d'appel pour associer des utilisateurs aux localisations avec département
await addLocalisationToUser("jean55", "Bar-le-Duc", "Meuse");
await addLocalisationToUser("marie62", "Calais", "Pas-de-Calais");
await addLocalisationToUser("paul77", "Melun", "Seine-et-Marne");
await addLocalisationToUser("claudine60", "Beauvais", "Oise");
await addLocalisationToUser("jeanluc64", "Pau", "Pyrénées-Atlantiques");
await addLocalisationToUser("monique68", "Colmar", "Haut-Rhin");
await addLocalisationToUser("georges71", "Mâcon", "Saône-et-Loire");
await addLocalisationToUser("bernadette66", "Perpignan", "Pyrénées-Orientales");
await addLocalisationToUser("pierrette59", "Lille", "Nord");
await addLocalisationToUser("alain69", "Lyon", "Rhône");

// Fonction pour ajouter un événement à une localisation avec un département
async function addLocalisationToEvent(eventName, localisationCity, department) {
    // Vérifier si la localisation avec la ville et le département existe
    let localisation = await Localisation.findOne({
        where: {
            city: localisationCity,
            department: department,
        },
    });

    // Si la localisation n'existe pas, créer une nouvelle localisation
    if (!localisation) {
        localisation = await Localisation.create({
            city: localisationCity,
            department: department,
        });
    }

    // Récupérer l'événement
    const event = await Event.findOne({ where: { name: eventName } });

    // Vérifier si l'événement existe
    if (!event) {
        throw new Error("Event not found");
    }

    // Associer l'événement à la localisation
    await event.setLocalisation(localisation);
}

// Exemple d'appel pour associer des événements aux localisations avec département
await addLocalisationToEvent("Café Rencontre et Discussions", "Lille", "Nord");
await addLocalisationToEvent("Soirée dansante rétro", "Perpignan", "Pyrénées-Orientales");
await addLocalisationToEvent("Randonnée douce en forêt", "Pau", "Pyrénées-Atlantiques");
await addLocalisationToEvent("Atelier Cuisine et Partage", "Lyon", "Rhône");
await addLocalisationToEvent("Soirée cinéma et discussion", "Colmar", "Haut-Rhin");

// Création des conversations fictives
async function createConversation(senderId, receiverId, content) {
    const sender = await User.findOne({ where: { pseudo: senderId } });
    const receiver = await User.findOne({ where: { pseudo: receiverId } });

    if (!sender || !receiver) {
        throw new Error(`Les utilisateurs ${senderId} ou ${receiverId} n'ont pas été trouvés`);
    }

    // Vérifie si une conversation entre les deux utilisateurs existe déjà
    let conversation = await Conversation.findOne({
        where: {
            sender_id: sender.id,
            receiver_id: receiver.id,
        },
    });

    const newMessage = `[${new Date().toISOString()}] ${senderId}: ${content}\n`;

    // Si la conversation existe, ajoute un nouveau message à la conversation
    if (conversation) {
        // Ajoute le nouveau message à la suite du contenu existant
        conversation.content += newMessage;
        await conversation.save();

        console.log(`✅ Nouveau message ajouté à la conversation entre ${senderId} et ${receiverId}`);
    } else {
        // Crée la conversation entre user1 et user2
        conversation = await Conversation.create({
            sender_id: sender.id,
            receiver_id: receiver.id,
            content: newMessage,
        });

        console.log(`✅ Conversation créée entre ${senderId} et ${receiverId}`);
    }
}

// Ajouter des conversations entre certains utilisateurs
// Conversations supplémentaires simulées
await createConversation("jean55", "marie62", "Salut Marie, comment vas-tu ?");
await createConversation("marie62", "jean55", "Très bien merci Jean ! Et toi ?");
await createConversation("jean55", "marie62", "Super ! Tu veux qu’on se voie cette semaine ?");

await createConversation("paul77", "claudine60", "Bonjour Claudine, tu fais quoi ce week-end ?");
await createConversation("claudine60", "paul77", "Bonjour Paul ! Je pense à faire un peu de jardinage, et toi ?");
await createConversation("paul77", "claudine60", "Je vais faire une petite randonnée, peut-être que tu aimerais m’accompagner ?");
await createConversation("claudine60", "paul77", "Ça me tente bien ! Je pourrais te rejoindre samedi après-midi.");

await createConversation("jeanluc64", "monique68", "J’ai vu qu’on aime tous les deux la randonnée !");
await createConversation("monique68", "jeanluc64", "C’est vrai ! J’adore les balades en forêt. Tu fais souvent des randos ?");
await createConversation("jeanluc64", "monique68", "Oui, presque tous les week-ends. On pourrait faire une sortie ensemble un de ces jours.");
await createConversation("monique68", "jeanluc64", "Avec plaisir ! Ça pourrait être sympa de découvrir de nouveaux sentiers ensemble.");

await createConversation("georges71", "bernadette66", "La musique classique, c’est aussi ta passion ?");
await createConversation("bernadette66", "georges71", "Oui, j’adore ! En particulier les symphonies de Beethoven. Et toi ?");
await createConversation("georges71", "bernadette66", "Je suis plus un fan de Chopin, mais Beethoven est un génie aussi. Tu vas à des concerts ?");
await createConversation("bernadette66", "georges71", "Oui, parfois. Ça te dirait d’aller à un concert ensemble ?");

await createConversation("alain69", "pierrette59", "Bonsoir Pierrette, ravie de discuter avec toi 😊");
await createConversation("pierrette59", "alain69", "Bonsoir Alain, c’est un plaisir aussi ! Tu aimes quoi dans la vie ?");
await createConversation("alain69", "pierrette59", "J’adore la bonne cuisine et les films d’antan. Et toi ?");
await createConversation("pierrette59", "alain69", "La lecture et les promenades en bord de mer. Peut-être qu’on pourrait se retrouver pour discuter autour d’un café ?");
await createConversation("alain69", "pierrette59", "Ça me semble une excellente idée !");

await createConversation("jeanluc64", "bernadette66", "Salut Bernadette, comment va ta semaine ?");
await createConversation("bernadette66", "jeanluc64", "Salut Jean-Luc, elle se passe bien ! J’ai commencé un nouveau livre, c’est passionnant.");
await createConversation("jeanluc64", "bernadette66", "Ah, quel genre de livre ? Moi je suis plutôt cinéma !");
await createConversation("bernadette66", "jeanluc64", "C’est un roman historique. Tu devrais essayer, c’est fascinant !");
await createConversation("jeanluc64", "bernadette66", "Je vais y penser ! Merci pour le conseil 😊");

await createConversation("pierrette59", "georges71", "Bonjour Georges, j’ai vu que tu aimes la musique classique, quel est ton compositeur préféré ?");
await createConversation("georges71", "pierrette59", "Salut Pierrette ! Beethoven, sans hésiter. Et toi ?");
await createConversation("pierrette59", "georges71", "J’aime beaucoup Chopin, il a une telle sensibilité dans ses œuvres.");
await createConversation("georges71", "pierrette59", "Je comprends, Chopin est un poète. Tu joues d’un instrument ?");
await createConversation("pierrette59", "georges71", "Oui, je joue du piano, mais j’aime aussi écouter les autres jouer.");

console.log("✅ Conversations créées entre utilisateurs");

process.exit();
