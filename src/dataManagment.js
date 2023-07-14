const fs = require('fs');

// Initialize pearlPlayer object
let playerPearl = {};
let stasisChambers = {};

/**
 * Save the player positions to a JSON file called playerPearl.json.
 */
function savePositions() {
    // Save player positions in playerPearl.json
    fs.writeFileSync("../playerPearl.json", JSON.stringify(playerPearl));
    fs.writeFileSync("../stasisChambers.json", JSON.stringify(stasisChambers));
}

/**
 * Load player positions from the playerPearl.json file.
 */
function loadPositions() {
    if (fs.existsSync("../stasisChambers.json")) {
        let data = fs.readFileSync("../stasisChambers.json");

        // Check if the file is empty
        if (data.length === 0) {
            console.warn("Stasis Chambers file is empty. The bot won't do anything.");
        } else {
            // Parse the JSON data and assign it to stasisChambers
            stasisChambers = JSON.parse(data);
        }
    } else {
        console.warn("Stasis Chambers file does not exist. The bot won't do anything.");
        fs.writeFileSync("../stasisChambers.json", "{}");
    }

    if (fs.existsSync("../playerPearl.json")) {
        let data = fs.readFileSync("../playerPearl.json");

        // Check if the file is not empty
        if (data.length !== 0) {
            // Parse the JSON data and assign it to playerPearl
            playerPearl = JSON.parse(data);
        }
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

module.exports = {
    savePositions,
    loadPositions,
    getPlayerPearl,
    getStasisChambers
};
