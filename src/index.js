// Import required modules
const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const autoEat = require("mineflayer-auto-eat");
const fs = require('fs');
const { setupSettingScreen } = require('./settings.js');
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

// Import the dataManagement module
let dataManager = require('./dataManagement.js');
let settings = {};

// Read and split credentials from file

let isConnected = false;
let chatSigning = true;

// Check for the "--settings" command-line argument
const args = process.argv.slice(2);
const useSettings = args.includes('--settings');

// Function to connect the bot
function connect() {
    if (isConnected) {
        return;
    }

    // Check if all required settings are defined
    if (settings.serverIP === undefined || settings.serverPort === undefined || settings.username === undefined || settings.password === undefined || settings.minecraftVersion === undefined || settings.chatSigning === undefined) {
        console.log("Please start the bot with the '--settings' argument to set the required settings. Or set them manually in the 'settings.json' file.");
        process.exit(1);
    }

    // Create bot instance
    const instance = mineflayer.createBot({
        host: settings.serverIP,
        port: settings.serverPort,
        username: settings.username,
        password: settings.password,
        version: settings.minecraftVersion,
        auth: 'microsoft',
        disableChatSigning: !settings.chatSigning
    });

    // Load the autoEat plugin and pathfinder
    instance.loadPlugin(autoEat.plugin);
    instance.loadPlugin(pathfinder);

    // Event handlers
    instance.on('whisper', handleWhisperEvent.bind(null, instance));
    instance.on('kicked', (reason) => settings.chatSigning = reason.includes("unsigned_chat") ? false : settings.chatSigning);
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

// If '--settings' argument is provided, implement the settings handling logic here
if (useSettings) {
    setupSettingScreen();
} else {
    dataManager.loadSettings();
    settings = dataManager.getSettings();
}

// Initialize pearlPlayer
initData();

// Call connect function to start the bot
connect();
