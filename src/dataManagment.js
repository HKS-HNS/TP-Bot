const fs = require('fs');

// Initialize pearlPlayer object
let pearlPlayer = {};

/**
 * Save the player positions to a JSON file called playerPearl.json.
 */
function savePlayerPositions() {
    // Save player positions in playerPearl.json
    fs.writeFileSync("../playerPearl.json", JSON.stringify(getPlayerPosition()));
    console.log(JSON.stringify(pearlPlayer));
}

/**
 * Load player positions from the playerPearl.json file.
 */
function loadPlayerPositions() {
    if (fs.existsSync("../playerPearl.json")) {
        let data = fs.readFileSync("../playerPearl.json");
        // Check if the file is empty
        if (data.length === 0) {
            return;
        }
        // Parse the JSON data and assign it to pearlPlayer
        pearlPlayer = JSON.parse(data);
    }
}

/**
 * Get the current player positions.
 * @returns {Object} - The player positions.
 */
function getPlayerPosition() {
    return pearlPlayer;
}


module.exports = {
    savePlayerPositions,
    loadPlayerPositions,
    getPlayerPosition,
};
