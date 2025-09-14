// English word configuration for the Imposter game

const WORD_CATEGORIES_EN = {
    "clothing": {
        name: "Clothing & Accessories",
        words: [
            // Easy
            "Shirt", "Pants", "Hat", "Socks", "Shoes",
            "Jacket", "Scarf", "Gloves", "Dress", "Belt",
            // Medium
            "Sweater", "Hoodie", "Tie", "Necklace", "Bracelet",
            "Ring", "Boots", "Sandals", "Skirt", "Sunglasses",
            // Hard
            "Cufflinks", "Brooch", "Fedora", "Tuxedo Belt", "Espadrilles",
            "Cardigan", "Bolero", "Fascinator", "Loafers", "Amulet"
        ]
    },
    "emotions": {
        name: "Feelings & Emotions",
        words: [
            // Easy
            "Happy", "Sad", "Angry", "Scared", "Love",
            "Tired", "Shy", "Excited", "Surprised", "Grumpy",
            // Medium
            "Anxious", "Confident", "Jealous", "Hopeful", "Curious",
            "Proud", "Lonely", "Frustrated", "Grateful", "Overwhelmed",
            // Hard
            "Nostalgic", "Ambivalent", "Serene", "Melancholic", "Euphoric",
            "Apprehensive", "Indignant", "Jubilant", "Pensive", "Vexed"
        ]
    },
    "kitchen": {
        name: "In the Kitchen",
        words: [
            // Easy
            "Spoon", "Fork", "Plate", "Cup", "Bowl",
            "Knife", "Pot", "Pan", "Fridge", "Sink",
            // Medium
            "Whisk", "Spatula", "Blender", "Toaster", "Kettle",
            "Oven", "Ladle", "Grater", "Cutting Board", "Strainer",
            // Hard
            "Mandoline", "Immersion Blender", "Dutch Oven", "Mortar and Pestle", "Zester",
            "Soufflé Mold", "Tongs", "Ramekin", "Cleaver", "Pastry Brush"
        ]
    },
    "hobbies": {
        name: "Hobbies & Crafts",
        words: [
            // Easy
            "Painting", "Drawing", "Reading", "Video Game", "Dancing",
            "Singing", "Fishing", "Hiking", "Cooking", "Gardening",
            // Medium
            "Knitting", "Photography", "Camping", "Pottery", "Yoga",
            "Scrapbooking", "Woodworking", "Calligraphy", "Origami", "Chess",
            // Hard
            "Macramé", "Lapidary", "Falconry", "Geocaching", "Glassblowing",
            "Bookbinding", "Taxidermy", "Electronics", "Topiary", "Quilling"
        ]
    },
    "fiction": {
        name: "Fictional Characters",
        words: [
            // Easy
            "Mickey Mouse", "Superman", "Cinderella", "SpongeBob", "Elsa",
            "Pikachu", "Homer Simpson", "Winnie the Pooh", "Bugs Bunny", "Mario",
            // Medium
            "Sherlock Holmes", "Katniss Everdeen", "Gandalf", "Wonder Woman", "Luke Skywalker",
            "James Bond", "Iron Man", "Willy Wonka", "Paddington Bear", "Doctor Who",
            // Hard
            "Atticus Finch", "Don Quixote", "Jay Gatsby", "Lisbeth Salander", "Ebenezer Scrooge",
            "Captain Ahab", "Hercule Poirot", "Odysseus", "Beowulf", "Asterix"
        ]
    },
    "history": {
        name: "Historical Figures",
        words: [
            // Easy
            "Julius Caesar", "Cleopatra", "Leonardo da Vinci", "Christopher Columbus", "Napoleon Bonaparte",
            "Louis XIV", "Albert Einstein", "Martin Luther King Jr.", "Joan of Arc", "Queen Elizabeth",
            // Medium
            "William Shakespeare", "Marie Curie", "Isaac Newton", "Galileo", "Marco Polo",
            "Genghis Khan", "Alexander the Great", "Amelia Earhart", "Winston Churchill", "Vercingetorix",
            // Hard
            "Nicolaus Copernicus", "Sun Tzu", "Mansa Musa", "Confucius", "Hypatia",
            "Charlemagne", "Sacagawea", "Nikola Tesla", "Simón Bolívar", "Robespierre"
        ]
    },
    "weather": {
        name: "Weather & Seasons",
        words: [
            // Easy
            "Rain", "Snow", "Sun", "Wind", "Cloud",
            "Storm", "Summer", "Winter", "Spring", "Autumn",
            // Medium
            "Hurricane", "Tornado", "Fog", "Hail", "Lightning",
            "Thunder", "Drought", "Blizzard", "Monsoon", "Humidity",
            // Hard
            "Derecho", "Haboob", "Sleet", "Graupel", "Virga",
            "Petrichor", "Equinox", "Solstice", "Polar Vortex", "Cyclone"
        ]
    },
    "body": {
        name: "Body Parts",
        words: [
            // Easy
            "Head", "Arm", "Leg", "Hand", "Foot",
            "Eye", "Nose", "Mouth", "Ear", "Hair",
            // Medium
            "Shoulder", "Elbow", "Knee", "Stomach", "Brain",
            "Heart", "Lung", "Finger", "Toe", "Spine",
            // Hard
            "Pancreas", "Spleen", "Cerebellum", "Kneecap", "Ulna",
            "Cochlea", "Pituitary", "Diaphragm", "Epidermis", "Shoulder Blade"
        ]
    },
    "science": {
        name: "Science & Space",
        words: [
            // Easy
            "Star", "Planet", "Moon", "Sun", "Earth",
            "Water", "Air", "Atom", "Gravity", "Light",
            // Medium
            "Molecule", "Comet", "Galaxy", "Asteroid", "Telescope",
            "DNA", "Energy", "Magnet", "Fossil", "Acid",
            // Hard
            "Nebula", "Quasar", "Supernova", "Black Hole", "Photosynthesis",
            "Mitochondria", "Particle Accelerator", "Quantum Physics", "Singularity", "Dark Matter"
        ]
    },
    "brands": {
        name: "Brands & Companies",
        words: [
            // Easy
            "Google", "Apple", "McDonald's", "Nike", "Disney",
            "Coca-Cola", "Amazon", "LEGO", "Netflix", "Ford",
            // Medium
            "Starbucks", "IKEA", "Microsoft", "Samsung", "Adidas",
            "Pepsi", "Toyota", "Nintendo", "Marvel", "Walmart",
            // Hard
            "Tesla", "SpaceX", "Airbus", "Mercedes-Benz", "Louis Vuitton",
            "Rolls-Royce", "Ferrari", "Lamborghini", "Rolex", "Hermès"
        ]
    }
};

// Export for use in the game
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = WORD_CATEGORIES_EN;
} else {
    // Browser environment
    window.WORD_CATEGORIES_EN = WORD_CATEGORIES_EN;
}