// Import the File System module
const fs = require('fs');

// Initialize objects to store data
let playerPearl = {};
let stasisChambers = {};
let settings = {};

/**
 * Save the player positions and stasis chambers to JSON files.
 */
function savePositions() {
    // Save player positions to playerPearl.json
    fs.writeFileSync("../playerPearl.json", JSON.stringify(playerPearl));

    // Save stasis chambers to stasisChambers.json
    fs.writeFileSync("../stasisChambers.json", JSON.stringify(stasisChambers));
}

/**
 * Save settings to a JSON file.
 */
function saveSettings() {
    // Save settings to settings.json
    fs.writeFileSync("../settings.json", JSON.stringify(settings));
}

/**
 * Load player positions from the playerPearl.json file.
 * Load stasis chambers from the stasisChambers.json file.
 */
function loadPositions() {

    process.on('SIGINT', handleProgramExit);
    process.on('SIGTERM', handleProgramExit);

    // Check if stasisChambers.json file exists
    if (fs.existsSync("../stasisChambers.json")) {
        let data = fs.readFileSync("../stasisChambers.json", 'utf8');

        // Check if the file is empty
        if (data.length === 0) {
            console.warn("Stasis Chambers file is empty. The bot won't do anything.");
        } else {
            // Parse the JSON data and assign it to stasisChambers
            stasisChambers = JSON.parse(data);
        }
    } else {
        console.warn("Stasis Chambers file does not exist. The bot won't do anything.");
        // Create an empty stasisChambers.json file
        fs.writeFileSync("../stasisChambers.json", "{}");
    }

    // Check if playerPearl.json file exists
    if (fs.existsSync("../playerPearl.json")) {
        let data = fs.readFileSync("../playerPearl.json", 'utf8');

        // Check if the file is not empty
        if (data.length !== 0) {
            // Parse the JSON data and assign it to playerPearl
            playerPearl = JSON.parse(data);
        }
    }
}

/**
 * Load settings from the settings.json file.
 * If the file doesn't exist, create it with an empty object.
 */
function loadSettings() {
    if (fs.existsSync("../settings.json")) {
        let data = fs.readFileSync("../settings.json", 'utf8');

        // Check if the file is not empty
        if (data.length !== 0) {
            // Parse the JSON data and assign it to settings
            settings = JSON.parse(data);
        }
    } else {
        // Create an empty settings.json file
        fs.writeFileSync("../settings.json", "{}");
    }
}

/**
 * Get the current player positions.
 * @returns {Object} - The player positions.
 */
function getPlayerPearl() {
    return playerPearl;
}

/**
 * Get the stasis chambers.
 * @returns {Object} - The stasis chambers.
 */
function getStasisChambers() {
    return stasisChambers;
}

/**
 * Get the settings.
 * @returns {Object} - The settings.
 */
function getSettings() {
    return settings;
}

function handleProgramExit() {
    savePositions();
    process.exit();
}

// Export the functions to be used in other modules
module.exports = {
    savePositions,
    saveSettings,
    loadPositions,
    loadSettings,
    getPlayerPearl,
    getSettings,
    getStasisChambers
};


