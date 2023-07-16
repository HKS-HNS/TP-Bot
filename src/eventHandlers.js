const Vec3 = require('vec3');
const dataManager = require('./dataManagment.js');
const { isUUID, pressButton, searchStasisChambers, getCoordinates } = require('./utils.js');

// Initialize pearlPlayer object
let playerPearl = {};
let stasisChambers = {};

/**
 * Handles the whisper event.
 * @param {Object} instance - The instance of the mineflayer bot.
 * @param {string} username - The username of the player sending the whisper.
 * @param {string} message - The whisper message.
 */
function handleWhisperEvent(instance, username, message) {
    // Ignore if the whisper is sent by the bot itself
    if (username === instance.username) return;

    if (message.endsWith("tp spawn")) {
        // Search for the UUID of the player sending the message in the 'playerPearl' object
        const coords = searchStasisChambers(getCoordinates(playerPearl, instance, username), stasisChambers);
        // Attack the pearl entity
        if (coords === null) return;
        pressButton(instance, coords);
    }
}

/**
 * Handles the chat event.
 * @param {Object} instance - The instance of the mineflayer bot.
 * @param {string} id - The ID of the packet.
 * @param {Object} data - The data associated with the chat event packet.
 * @param {Object} packetMeta - The metadata of the packet.
 */
function handleChatEvent(instance, id, data, packetMeta) {
    if (packetMeta.name === "player_chat" && data.plainMessage === "!sleep") {
        const bed = instance.findBlock({
            matching: id,
            maxDistance: 6
        });
        if (bed) {
            try {
                instance.sleep(bed);
            } catch (e) {
                if (e.message === "it's not night and it's not a thunderstorm") {
                    // Handle the error by sending a message
                    instance.chat("Is it night or did I have a bad dream?");
                } else {
                    // Handle other errors or log them for debugging
                    console.error(e);
                }
            }
        }
    }
}

/**
 * Handles the spawn entity packet event.
 * @param {Object} instance - The instance of the mineflayer bot.
 * @param {string} id - The ID of the entity.
 * @param {Object} data - The data associated with the spawn entity packet.
 * @param {Object} packetMeta - The metadata of the packet.
 */
function handleSpawnEntityPacketEvent(instance, id, data, packetMeta) {
    // Check if the spawned entity is an ender pearl (ID: 28)
    if (packetMeta.name === "spawn_entity" && data.type === id) {
        setTimeout(() => {
            if (data.objectData === 0) return;

            // Check if the entity exists in the 'entities' object
            if (instance.entities[data.objectData.toString()] === undefined && !isUUID(playerPearl[data.objectUUID])) {
                playerPearl[data.objectUUID] = data.objectData;
            } else if (instance.entities[data.objectData] !== undefined) {
                playerPearl[data.objectUUID] = instance.entities[data.objectData].uuid;
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
    Object.keys(playerPearl).forEach(key => {
        const uuid = Object.keys(playerPearl).find(playerKey => playerPearl[playerKey] === entity.id);
        if (uuid !== undefined) {
            playerPearl[key] = entity.uuid;
        }
    });
}

/**
 * Handles the despawn event.
 * @param {Object} instance - The instance of the mineflayer bot.
 * @param {string} id - The ID of the entity.
 * @param {Object} entity - The despawned entity.
 */
function handleDespawnEvent(instance, id, entity) {
    if (entity.entityType === 28) {
        delete playerPearl[entity.uuid];
    }
}

/**
 * Handles the program exit event.
 */
function handleProgramExit() {
    dataManager.savePositions();
    process.exit();
}

/**
 * Handles the spawn event.
 * @param {Object} instance - The instance of the mineflayer bot.
 */
function handleSpawnEvent(instance) {
    for (let uuid in playerPearl) {
        if (!Object.values(instance.entities).some(entity => entity.uuid === uuid)) {
            delete playerPearl[uuid];
        }
    }
}

/**
 * Initializes the pearlPlayer object.
 */
function initData() {
    dataManager.loadPositions();
    playerPearl = dataManager.getPlayerPearl();
    stasisChambers = dataManager.getStasisChambers();
}

module.exports = {
    handleWhisperEvent,
    handleSpawnEntityEvent,
    handleSpawnEntityPacketEvent,
    handleDespawnEvent,
    handleProgramExit,
    handleChatEvent,
    initData,
    handleSpawnEvent
};
