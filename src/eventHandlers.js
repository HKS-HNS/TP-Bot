// Import required modules
const Vec3 = require('vec3');
const dataManager = require('./dataManagment.js');
const {
    isUUID,
    activateEnderPearl,
    pressButton,
    searchStasisChambers,
    getCoordinates
} = require('./utils.js');
const { Movements } = require('mineflayer-pathfinder');
const { inRangeOfStasisChambers } = require('./utils');
const mcData = require('minecraft-data');

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

    if (message.endsWith('tp')) {
        // Search for the UUID of the player sending the message in the 'playerPearl' object
        activateEnderPearl(playerPearl, stasisChambers, instance, instance.players[username].uuid);
    }
}

/**
 * Handles the chat event.
 * @param {Object} instance - The instance of the mineflayer bot.
 * @param {string} id - The ID of the packet.
 * @param {Object} data - The data associated with the chat event packet.
 * @param {Object} packetMeta - The metadata of the packet.
 */
function handleChatEvent(instance, data, packetMeta) {
    if (packetMeta.name === 'player_chat') {
        if (data.plainMessage === '!sleep') {
            const bedBlocks = Object.values(mcData(instance.version).blocksByName).filter(
                (block) => block.name.includes('bed') && !block.name.includes('bedrock')
            );
            const bedIds = bedBlocks.map((block) => block.id);
            const bed = instance.findBlock({
                matching: bedIds,
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
        } else if (data.plainMessage === '!tp spawn') {
            activateEnderPearl(playerPearl, stasisChambers, instance, data.senderUuid);
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
function handleSpawnEntityPacketEvent(instance, data, packetMeta) {
    // Check if the spawned entity is an ender pearl (ID: 28)
    if (packetMeta.name === 'spawn_entity' && data.type === mcData(instance.version).entitiesByName['ender_pearl'].id) {
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
    Object.keys(playerPearl).forEach((key) => {
        const uuid = Object.keys(playerPearl).find((playerKey) => playerPearl[playerKey] === entity.id);
        if (uuid !== undefined) {
            playerPearl[key] = entity.uuid;
        }
    });
}

/**
 * Handles the physic tick event.
 * @param {Object} instance - The instance of the mineflayer bot.
 */
function handlePhysicTick(instance) {
    // Check if all the pearls are at the right position
    if (instance.entity !== null && inRangeOfStasisChambers(stasisChambers, instance)) {
        for (let uuid in playerPearl) {
            const pearl = Object.values(instance.entities).find((entity) => entity.uuid === uuid);
            if (pearl !== undefined && searchStasisChambers([pearl.position], stasisChambers) === null) {
                delete playerPearl[uuid];
            }
        }
    }
}

/**
 * Handles the despawn event.
 * @param {Object} instance - The instance of the mineflayer bot.
 * @param {string} id - The ID of the entity.
 * @param {Object} entity - The despawned entity.
 */
function handleDespawnEvent(instance, entity) {
    if (entity.entityType === mcData(instance.version).entitiesByName['ender_pearl'].id && inRangeOfStasisChambers(stasisChambers, instance)) {
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
 * @param {boolean} isConnected - Whether the bot is connected to the server or not.
 */
function handleSpawnEvent(instance, isConnected) {
    const defaultMove = new Movements(instance, mcData(instance.version));
    defaultMove.canDig = false;
    defaultMove.allow1by1towers = false;
    instance.pathfinder.setMovements(defaultMove);
    isConnected = true;
    instance.autoEat.options = {
        priority: 'saturation',
        bannedFood: []
    };

    for (let uuid in playerPearl) {
        if (!Object.values(instance.entities).some((entity) => entity.uuid === uuid) && inRangeOfStasisChambers(stasisChambers, instance)) {
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

// Export functions
module.exports = {
    handleWhisperEvent,
    handleSpawnEntityEvent,
    handleSpawnEntityPacketEvent,
    handleDespawnEvent,
    handleProgramExit,
    handlePhysicTick,
    handleChatEvent,
    initData,
    handleSpawnEvent
};
