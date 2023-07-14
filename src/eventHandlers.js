// Import required modules
const dataManager = require('./dataManagment.js');
const { isUUID } = require('./utils.js');

// Initialize pearlPlayer object
let pearlPlayer = {};

/**
 * Handles the whisper event.
 * @param {Object} instance - The instance of the mineflayer bot.
 * @param {string} username - The username of the player sending the whisper.
 * @param {string} message - The whisper message.
 */
function handleWhisperEvent(instance, username, message) {
    // Ignore if the whisper is sent by the bot itself
    if (username === instance.username) return;

    if (message === "teleport") {
        // Search for the UUID of the player sending the message in the 'pearlPlayer' object
        let uuid = Object.keys(pearlPlayer).find(key => pearlPlayer[key] === instance.players[username].uuid);

        if (uuid === undefined) return;

        // Find the entity with the UUID in the 'entities' object
        const pearl = instance.entities[Object.keys(instance.entities).find(key => instance.entities[key].uuid === uuid)];

        if (pearl === undefined) return;

        // Attack the pearl entity
        instance.attack(pearl);

        // Send a chat message with teleport information
        instance.chat("tell " + username + " teleporting to " + pearl.position.x + " " + pearl.position.y + " " + pearl.position.z);
    } else if (message === "getdata") {
        console.log("Loading player positions:", dataManager.getPlayerPosition());
    }
}

/**
 * Handles the spawn entity packet event.
 * @param {Object} instance - The instance of the mineflayer bot.
 * @param {Object} data - The data associated with the spawn entity packet.
 * @param {Object} packetMeta - The metadata of the packet.
 */
function handleSpawnEntityPacketEvent(instance, data, packetMeta) {
    // Check if the spawned entity is an ender pearl (ID: 28)
    if (packetMeta.name === "spawn_entity" && data.type === 28) {
        setTimeout(function() {
            if (data.objectData === 0) return;

            // Check if the entity exists in the 'entities' object
            if (instance.entities[data.objectData.toString()] === undefined && !isUUID(pearlPlayer[data.objectUUID])) {
                pearlPlayer[data.objectUUID] = data.objectData;
            } else if (instance.entities[data.objectData] !== undefined) {
                pearlPlayer[data.objectUUID] = instance.entities[data.objectData].uuid;
            }
        }, 10);
    }
}

/**
 * Handles the spawn entity event.
 * @param {Object} instance - The instance of the mineflayer bot.
 * @param {Object} entity - The spawned entity.
 */
function handleSpawnEntityEvent(instance, entity) {
    // Check if the entity is a player
    Object.keys(pearlPlayer).forEach(key => {
        let uuid = Object.keys(pearlPlayer).find(playerKey => pearlPlayer[playerKey] === entity.id);
        if (uuid !== undefined) {
            pearlPlayer[key] = entity.uuid;
        }
    });
}

/**
 * Handles the despawn event.
 * @param {Object} instance - The instance of the mineflayer bot.
 * @param {Object} entity - The despawned entity.
 */
function handleDespawnEvent(instance, entity) {
    if (entity.entityType === 28) {
        delete pearlPlayer[entity.uuid];
    }
}

/**
 * Handles the program exit event.
 */
function handleProgramExit() {
    dataManager.savePlayerPositions();
    process.exit();
}

/**
 * Handles the spawn event.
 * @param {Object} instance - The instance of the mineflayer bot.
 */
function handleSpawnEvent(instance) {
    for (let uuid in pearlPlayer) {
        if (!Object.values(instance.entities).some(entity => entity.uuid === uuid)) {
            delete pearlPlayer[uuid];
        }
    }
}

/**
 * Initializes the pearlPlayer object.
 * @param {Object} instance - The instance of the mineflayer bot.
 */
function initPearlPlayer(instance) {
    dataManager.loadPlayerPositions();
    pearlPlayer = dataManager.getPlayerPosition();
}

module.exports = {
    handleWhisperEvent,
    handleSpawnEntityEvent,
    handleSpawnEntityPacketEvent,
    handleDespawnEvent,
    handleProgramExit,
    initPearlPlayer,
    handleSpawnEvent
};
