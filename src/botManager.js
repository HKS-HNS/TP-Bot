// Import required modules
const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const autoEat = require("mineflayer-auto-eat");

const {

} = require("./eventHandlers.js");
const dataManager = require("./dataManagment");
const {setupChatEvents} = require("./event/chatEvents");
const {setupEntityDespawnEvents} = require("./event/entityDespawnEvents");
const {setupEntitySpawnEvents} = require("./event/entitySpawnEvents");
const setupPhysicTick = require("./event/physicTick");
const {setupSpawnEvents} = require("./event/spawnEvent");

// Function to connect the bot
function createBot(config) {

    // Create bot instance
    const instance = mineflayer.createBot({
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        version: config.version,
        auth: config.auth
    });

    dataManager.loadPositions();
    let playerPearl = dataManager.getPlayerPearl();
    let stasisChambers = dataManager.getStasisChambers();

    // Load the autoEat plugin and pathfinder
    instance.loadPlugin(autoEat.plugin);
    instance.loadPlugin(pathfinder);

    // Event handlers

    instance.on('error', (err) => console.log(err.message));
    setupChatEvents(instance);
    setupEntityDespawnEvents(instance);
    setupEntitySpawnEvents(instance, playerPearl);
    setupPhysicTick(instance, stasisChambers, playerPearl);
    setupSpawnEvents(instance, playerPearl, stasisChambers);

    return instance;
}

module.exports = { createBot };

