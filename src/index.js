const mineflayer = require('mineflayer');
const autoEat = require("mineflayer-auto-eat");
const { loadPlayerPositions } = require('./dataManagment.js');
const fs = require('fs');
const {
    handleWhisperEvent,
    handleSpawnEntityEvent,
    handleSpawnEntityPacketEvent,
    handleDespawnEvent,
    handleProgramExit,
    handleSpawnEvent,
    initPearlPlayer
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

    const instance = mineflayer.createBot({
        host: credentials[0],
        port: 25565,
        username: credentials[1],
        password: credentials[2],
        version: "1.20.1",
        auth: 'microsoft',
        disableChatSigning: !chatSigning
    });

    // Event handler for 'spawn' event
    instance.once('spawn', () => {
        isConnected = true;
        instance.autoEat.options = {
            priority: 'saturation',
            bannedFood: []
        };
    });

    // Load the autoEat plugin
    instance.loadPlugin(autoEat.plugin);

    // Event handlers
    instance.on('whisper', handleWhisperEvent.bind(null, instance));
    instance.on('kicked', handleKick.bind(null, instance));
    instance.on('entityGone', handleDespawnEvent.bind(null, instance));
    instance.on('entitySpawn', handleSpawnEntityEvent.bind(null, instance));
    instance.on('spawn', handleSpawnEvent.bind(null, instance));
    instance._client.on('packet', handleSpawnEntityPacketEvent.bind(null, instance));
}

// Handle program exit signals
process.on('SIGINT', handleProgramExit);
process.on('SIGTERM', handleProgramExit);

// Event handler for 'kicked' event
function handleKick(instance, reason, loggedIn) {
    isConnected = false;

    if (reason.includes("unsigned_chat")) {
        chatSigning = false;
    }

    // Reconnect after 5 seconds
    setTimeout(() => {
        connect();
    }, 5000);
}

// Initialize pearlPlayer
initPearlPlayer();

// Call connect function to start the bot
connect();
