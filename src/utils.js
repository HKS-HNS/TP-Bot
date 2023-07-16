const {
    goals: {
        GoalNear
    }
} = require('mineflayer-pathfinder');
const Vec3 = require('vec3');

/**
 * Checks if a string is a valid UUID.
 * @param {string} str - The string to check.
 * @returns {boolean} - True if the string is a valid UUID, false otherwise.
 */
function isUUID(str) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}

/**
 * Sets a goal for the instance to move to the specified coordinates and press a button.
 * @param {Object} instance - The instance of the mineflayer bot.
 * @param {Object} coords - The coordinates to move to.
 */
function pressButton(instance, coords) {
    instance.pathfinder.setGoal(new GoalNear(coords.x, coords.y, coords.z, 6));

    // Event handler for 'goal_reached' event
    instance.once('goal_reached', () => {
        const block = instance.blockAt(coords);
        instance.activateBlock(block);
        if (block.name === 'lever' || block.name.includes('trapdoor')) {
            setTimeout(() => instance.activateBlock(block), 300);
        }
    });
}

/**
 * Searches for a key in the stasisChambers variable based on coordinates.
 * @param {Object} coordinates - The coordinates to search.
 * @param {Object} stasisChambers - The stasisChambers variable.
 * @returns {string|null} - The key found or null if not found.
 */
function searchStasisChambers(coordinates, stasisChambers) {
    const tolerance = 2;

    for (let key in stasisChambers) {
        const position = stasisChambers[key];

        for (let i = 0; i < coordinates.length; i++) {
            const { x, y, z } = coordinates[i];

            if (
                Math.floor(x) === position.x &&
                Math.floor(z) === position.z &&
                Math.abs(y - position.y) <= tolerance
            ) {
                return new Vec3(key);
            }
        }
    }

    return null;
}

/**
 * Gets the coordinates of the player pearls.
 * @param {Object} playerPearl - The player pearls object.
 * @param {Object} instance - The instance of the mineflayer bot.
 * @param {string} username - The username of the player.
 * @returns {Array} - The coordinates of the player pearls.
 */
function getCoordinates(playerPearl, instance, username) {
    const uuids = Object.keys(playerPearl).filter(key => playerPearl[key] === instance.players[username].uuid);

    if (uuids.length === 0) return [];

    return uuids.map(uuid => {
        const pearl = instance.entities[Object.keys(instance.entities).find(key => instance.entities[key].uuid === uuid)];
        if (pearl === undefined) return [];
        return pearl.position;
    });
}

module.exports = {
    isUUID,
    pressButton,
    searchStasisChambers,
    getCoordinates
};
