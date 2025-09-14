// Configuration des mots pour le jeu Imposteur
// Word configuration for the Imposter game

const WORD_CATEGORIES = {
    "vetements": {
        name: "Vêtements et Accessoires",
        words: [
            // Facile
            "Chemise", "Pantalon", "Chapeau", "Chaussettes", "Chaussures",
            "Veste", "Écharpe", "Gants", "Robe", "Ceinture",
            // Moyen
            "Pull", "Sweat à capuche", "Cravate", "Collier", "Bracelet",
            "Bague", "Bottes", "Sandales", "Jupe", "Lunettes de soleil",
            // Difficile
            "Boutons de manchette", "Broche", "Fedora", "Ceinture de smoking", "Espadrilles",
            "Cardigan", "Boléro", "Bibi", "Mocassins", "Amulette"
        ]
    },
    "emotions": {
        name: "Sentiments et Émotions",
        words: [
            // Facile
            "Heureux", "Triste", "En colère", "Effrayé", "Amour",
            "Fatigué", "Timide", "Excité", "Surpris", "Grincheux",
            // Moyen
            "Anxieux", "Confiant", "Jaloux", "Plein d'espoir", "Curieux",
            "Fier", "Seul", "Frustré", "Reconnaissant", "Débordé",
            // Difficile
            "Nostalgique", "Ambivalent", "Serein", "Mélancolique", "Euphorique",
            "Appréhensif", "Indigné", "Jubilatoire", "Pensif", "Vexé"
        ]
    },
    "cuisine": {
        name: "Dans la Cuisine",
        words: [
            // Facile
            "Cuillère", "Fourchette", "Assiette", "Tasse", "Bol",
            "Couteau", "Casserole", "Poêle", "Frigo", "Évier",
            // Moyen
            "Fouet", "Spatule", "Mixeur", "Grille-pain", "Bouilloire",
            "Four", "Louche", "Râpe", "Planche à découper", "Passoire",
            // Difficile
            "Mandoline", "Mixeur plongeant", "Cocotte", "Mortier et pilon", "Zesteur",
            "Moule à soufflé", "Pince", "Ramequin", "Couperet", "Pinceau de cuisine"
        ]
    },
    "loisirs": {
        name: "Loisirs et Artisanat",
        words: [
            // Facile
            "Peinture", "Dessin", "Lecture", "Jeu vidéo", "Danse",
            "Chant", "Pêche", "Randonnée", "Cuisine", "Jardinage",
            // Moyen
            "Tricot", "Photographie", "Camping", "Poterie", "Yoga",
            "Scrapbooking", "Menuiserie", "Calligraphie", "Origami", "Échecs",
            // Difficile
            "Macramé", "Lapidaire", "Fauconnerie", "Géocaching", "Soufflage de verre",
            "Reliure", "Taxidermie", "Circuit électronique", "Art topiaire", "Paperolle"
        ]
    },
    "fiction": {
        name: "Personnages de Fiction",
        words: [
            // Facile
            "Mickey Mouse", "Superman", "Cendrillon", "Bob l'éponge", "Elsa",
            "Pikachu", "Homer Simpson", "Winnie l'ourson", "Bugs Bunny", "Mario",
            // Moyen
            "Sherlock Holmes", "Katniss Everdeen", "Gandalf", "Wonder Woman", "Luke Skywalker",
            "James Bond", "Iron Man", "Willy Wonka", "Ours Paddington", "Doctor Who",
            // Difficile
            "Atticus Finch", "Don Quichotte", "Jay Gatsby", "Lisbeth Salander", "Ebenezer Scrooge",
            "Capitaine Achab", "Hercule Poirot", "Ulysse", "Beowulf", "Astérix"
        ]
    },
    "histoire": {
        name: "Personnages Historiques",
        words: [
            // Facile
            "Jules César", "Cléopâtre", "Léonard de Vinci", "Christophe Colomb", "Napoléon Bonaparte",
            "Louis XIV", "Albert Einstein", "Martin Luther King Jr.", "Jeanne d'Arc", "Reine Elizabeth",
            // Moyen
            "William Shakespeare", "Marie Curie", "Isaac Newton", "Galilée", "Marco Polo",
            "Gengis Khan", "Alexandre le Grand", "Amelia Earhart", "Winston Churchill", "Vercingétorix",
            // Difficile
            "Nicolas Copernic", "Sun Tzu", "Mansa Moussa", "Confucius", "Hypatie",
            "Charlemagne", "Sacagawea", "Nikola Tesla", "Simón Bolívar", "Robespierre"
        ]
    },
    "meteo": {
        name: "Météo et Saisons",
        words: [
            // Facile
            "Pluie", "Neige", "Soleil", "Vent", "Nuage",
            "Orage", "Été", "Hiver", "Printemps", "Automne",
            // Moyen
            "Ouragan", "Tornade", "Brouillard", "Grêle", "Éclair",
            "Tonnerre", "Sécheresse", "Blizzard", "Mousson", "Humidité",
            // Difficile
            "Derecho", "Haboob", "Grésil", "Neige roulée", "Virga",
            "Pétrichor", "Équinoxe", "Solstice", "Vortex polaire", "Cyclone"
        ]
    },
    "corps": {
        name: "Parties du Corps",
        words: [
            // Facile
            "Tête", "Bras", "Jambe", "Main", "Pied",
            "Œil", "Nez", "Bouche", "Oreille", "Cheveux",
            // Moyen
            "Épaule", "Coude", "Genou", "Ventre", "Cerveau",
            "Cœur", "Poumon", "Doigt", "Orteil", "Colonne vertébrale",
            // Difficile
            "Pancréas", "Rate", "Cervelet", "Rotule", "Cubitus",
            "Cochlée", "Hypophyse", "Diaphragme", "Épiderme", "Omoplate"
        ]
    },
    "science": {
        name: "Science et Espace",
        words: [
            // Facile
            "Étoile", "Planète", "Lune", "Soleil", "Terre",
            "Eau", "Air", "Atome", "Gravité", "Lumière",
            // Moyen
            "Molécule", "Comète", "Galaxie", "Astéroïde", "Télescope",
            "ADN", "Énergie", "Aimant", "Fossile", "Acide",
            // Difficile
            "Nébuleuse", "Quasar", "Supernova", "Trou noir", "Photosynthèse",
            "Mitochondrie", "Accélérateur de particules", "Physique quantique", "Singularité", "Matière noire"
        ]
    },
    "marques": {
        name: "Marques et Entreprises",
        words: [
            // Facile
            "Google", "Apple", "McDonald's", "Nike", "Disney",
            "Coca-Cola", "Amazon", "LEGO", "Netflix", "Renault",
            // Moyen
            "Starbucks", "IKEA", "Microsoft", "Samsung", "Adidas",
            "Pepsi", "Peugeot", "Nintendo", "Marvel", "Carrefour",
            // Difficile
            "LVMH", "Michelin", "Airbus", "Danone", "L'Oréal",
            "Orange", "TotalEnergies", "Sanofi", "AXA", "SpaceX"
        ]
    }
};

// Export for use in the game
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = WORD_CATEGORIES;
} else {
    // Browser environment
    window.WORD_CATEGORIES = WORD_CATEGORIES;
}