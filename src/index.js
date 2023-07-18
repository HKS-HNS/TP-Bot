// Import required modules
const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const autoEat = require("mineflayer-auto-eat");
const fs = require('fs');
const {
    handleWhisperEvent,
    handleSpawnEntityEvent,
    handleSpawnEntityPacketEvent,
    handleDespawnEvent,
    handleProgramExit,
    handlePhysicTick,
    handleSpawnEvent,
    handleChatEvent,
    initData
} = require("./eventHandlers.js");

let dataManager = require('./dataManagment.js');

// Read and split credentials from file
const credentials = fs.readFileSync("../credentials.txt").toString().split("\n");

let isConnected = false;
let chatSigning = true;

// Function to connect the bot
function connect() {
    if (isConnected) {
        return;
    }

    // Create bot instance
    const instance = mineflayer.createBot({
        host: credentials[0],
        port: 25565,
        username: credentials[1],
        password: credentials[2],
        version: "1.19.2",
        auth: 'microsoft',
        disableChatSigning: !chatSigning
    });

    // Load the autoEat plugin
    instance.loadPlugin(autoEat.plugin);
    instance.loadPlugin(pathfinder);

    // Event handlers
    instance.on('whisper', handleWhisperEvent.bind(null, instance));
    instance.on('kicked', (reason) => chatSigning = reason.includes("unsigned_chat") ? false : chatSigning);
    instance.on('entityGone', handleDespawnEvent.bind(null, instance));
    instance.on('entitySpawn', handleSpawnEntityEvent.bind(null, instance));
    instance.on('spawn', handleSpawnEvent.bind(null, instance).bind(null, isConnected));
    instance.on('physicTick', handlePhysicTick.bind(null, instance));
    instance.on('error', (err) => console.log(err.message));
    instance.on('end', () => {
        isConnected = false;
        setTimeout(() => {
            connect();
        }, 5000);
    });
    instance._client.on('packet', handleChatEvent.bind(null, instance));
    instance._client.on('packet', handleSpawnEntityPacketEvent.bind(null, instance));
}

// Handle program exit signals
process.on('SIGINT', handleProgramExit);
process.on('SIGTERM', handleProgramExit);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => console.log(err.message));

// Initialize pearlPlayer
initData();

// Call connect function to start the bot
connect();
