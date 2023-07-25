// Import required modules
const readline = require('readline');
const { spawnSync } = require('child_process');
const dataManager = require('./dataManagment.js');
const vec3 = require('vec3');
const { Vec3 } = require("vec3");

// Initialize global objects to store data
let stasisChambers = {};
let settings = {};

// Create a readline interface for handling user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Initialize the setting screen setup.
 * This function loads positions and settings data, and starts the startMenu function.
 */
async function setupSettingScreen() {
    await dataManager.loadPositions();
    await dataManager.loadSettings();
    stasisChambers = dataManager.getStasisChambers();
    settings = dataManager.getSettings();
    startMenu();
}

/**
 * Display the main start menu.
 */
function startMenu() {
    clearConsole();
    console.log("Settings:");
    console.log("1. Set credentials");
    console.log("2. Change stasis chamber");
    console.log("3. MC server settings");
    console.log("4. Exit");
    rl.question("Enter your choice: ", handleStartMenuChoice);
}

/**
 * Handle the user's choice in the main start menu.
 * @param {string} input - The user's input choice.
 */
function handleStartMenuChoice(input) {
    switch (input) {
        case "1":
            setCredMenu();
            break;
        case "2":
            setStasisMenu();
            break;
        case "3":
            mcServerMenu();
            break;
        case "4":
            dataManager.saveSettings(settings);
            rl.close();
            process.exit();
            break;
        default:
            console.log("Wrong input");
            startMenu();
            break;
    }
}

/**
 * Display the credentials menu.
 */
async function setCredMenu() {
    clearConsole();
    console.log("Set credentials:");
    console.log("1. Set username (email)");
    console.log("2. Set password");
    console.log("3. Back");
    console.log("4. Exit");
    const input = await askQuestion("Enter your choice: ");
    handleCredMenuChoice(input);
}

/**
 * Handle the user's choice in the credentials menu.
 * @param {string} input - The user's input choice.
 */
function handleCredMenuChoice(input) {
    switch (input) {
        case "1":
            rl.question("Enter username (email): ", newUsername => {
                settings.username = newUsername;
                console.log("Username set to:", newUsername);
                setCredMenu();
            });
            break;
        case "2":
            rl.question("Enter password: ", newPassword => {
                settings.password = newPassword;
                console.log("Password set to:", newPassword);
                setCredMenu();
            });
            break;
        case "3":
            startMenu();
            break;
        case "4":
            dataManager.saveSettings(settings);
            rl.close();
            process.exit();
            break;
        default:
            console.log("Wrong input");
            setCredMenu();
            break;
    }
}

/**
 * Display the stasis menu.
 */
async function setStasisMenu() {
    clearConsole();
    console.log("Set stasis chamber:");
    console.log("1. Add stasis chamber");
    console.log("2. Remove stasis chamber");
    console.log("3. Back");
    console.log("4. Exit");
    const input = await askQuestion("Enter your choice: ");
    await handleStasisMenuChoice(input);
}

/**
 * Handle the user's choice in the stasis menu.
 * @param {string} input - The user's input choice.
 */
async function handleStasisMenuChoice(input) {
    switch (input) {
        case "1":
            await addStasisChamber();
            setStasisMenu();
            break;
        case "2":
            await removeStasisChamber();
            setStasisMenu();
            break;
        case "3":
            startMenu();
            dataManager.saveSettings(settings);
            dataManager.savePositions(stasisChambers);
            break;
        case "4":
            dataManager.savePositions(stasisChambers);
            dataManager.saveSettings(settings);
            rl.close();
            break;
        default:
            console.log("Wrong input");
            setStasisMenu();
            break;
    }
}

/**
 * Display the MC server settings menu.
 */
async function mcServerMenu() {
    clearConsole();
    console.log("MC server settings:");
    console.log("1. Set server ip");
    console.log("2. Set server port");
    console.log("3. Set Version");
    console.log("4. Set chatSigning");
    console.log("5. Back");
    console.log("6. Exit");
    const input = await askQuestion("Enter your choice: ");
    handleMCServerMenuChoice(input);
}

/**
 * Handle the user's choice in the MC server settings menu.
 * @param {string} input - The user's input choice.
 */
function handleMCServerMenuChoice(input) {
    switch (input) {
        case "1":
            rl.question("Enter server IP: ", newServerIP => {
                const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
                if (!ipRegex.test(newServerIP) && newServerIP !== "localhost") {
                    console.log("Invalid IP / hostname");
                    mcServerMenu();
                    return;
                }
                settings.serverIP = newServerIP;
                console.log("Server IP set to:", newServerIP);
                mcServerMenu();
            });
            break;
        case "2":
            rl.question("Enter server port: ", newServerPort => {
                const portRegex = /^[0-9]{1,5}$/;
                if (!portRegex.test(newServerPort)) {
                    console.log("Invalid port");
                    mcServerMenu();
                    return;
                }
                settings.serverPort = newServerPort;
                console.log("Server port set to:", newServerPort);
                mcServerMenu();
            });
            break;
        case "3":
            rl.question("Enter Minecraft version like (1.19.2): ", newVersion => {
                const versionRegex = /^[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}$/;
                if (!versionRegex.test(newVersion)) {
                    console.log("Invalid version");
                    mcServerMenu();
                    return;
                }
                settings.minecraftVersion = newVersion;
                console.log("Minecraft version set to:", newVersion);
                mcServerMenu();
            });
            break;
        case "4":
            rl.question("Enter chatSigning (true or false): ", newChatSigning => {
                const chatSigningRegex = /^(true|false)$/;
                if (!chatSigningRegex.test(newChatSigning)) {
                    console.log("Invalid chatSigning, it has to be true or false");
                    mcServerMenu();
                    return;
                }
                settings.chatSigning = newChatSigning;
                console.log("ChatSigning set to:", newChatSigning);
                mcServerMenu();
            });
            break;
        case "5":
            startMenu();
            dataManager.saveSettings(settings);
            dataManager.savePositions(stasisChambers);
            break;
        case "6":
            dataManager.saveSettings(settings);
            dataManager.savePositions(stasisChambers);
            rl.close();
            process.exit();
            break;
        default:
            console.log("Wrong input");
            mcServerMenu();
            break;
    }
}

/**
 * Ask the user a question and wait for their input.
 * @param {string} question - The question to ask the user.
 * @returns {Promise<string>} - A promise that resolves to the user's input.
 */
function askQuestion(question) {
    return new Promise(resolve => {
        rl.question(question, answer => {
            resolve(answer.trim());
        });
    });
}

/**
 * Add a stasis chamber to the list of stasis chambers.
 */
async function addStasisChamber() {
    clearConsole();
    // Enter the coordinates for the activation object and the trapdoor
    const activationObject = await askQuestion("Enter the coordinates for the activation object like (10 123 -23): ");
    const trapdoor = await askQuestion("Enter the coordinates for the trapdoor where the pearl is like (13 123 -23): ");

    // Check if the coordinates are valid
    const coordinate = /^-?[0-9]{1,5} -?[0-9]{1,5} -?[0-9]{1,5}$/;
    if (!coordinate.test(activationObject) || !coordinate.test(trapdoor)) {
        console.log("Invalid coordinates");
        return;
    }

    stasisChambers[parseVec3FromString(activationObject)] = parseVec3FromString(trapdoor);
}

/**
 * Remove a stasis chamber from the list of stasis chambers.
 */
async function removeStasisChamber() {
    clearConsole();
    // Print the coordinates of the stasis chambers along with a number they can choose
    let statisChamberList = {};
    let i = 1;
    for (const [key, value] of Object.entries(stasisChambers)) {
        statisChamberList[i] = key;
        console.log(i + ". Activation pos: " + key + " Trapdoor: " + value.x + " " + value.y + " " + value.z);
        i++;
    }

    const input = await askQuestion("Enter the number of the stasis chamber you want to remove: ");
    if (!statisChamberList[input]) {
        console.log("Invalid number");
        return;
    }
    delete stasisChambers[statisChamberList[input]];
}

/**
 * Parse a string of coordinates and return a Vec3 object.
 * @param {string} str - The string containing the coordinates in the format "x y z".
 * @returns {Vec3} - The parsed Vec3 object.
 */
function parseVec3FromString(str) {
    const numbers = str.split(' ').map(Number);
    if (numbers.length !== 3 || numbers.some(isNaN)) {
        throw new Error('Invalid input format. Expected format: "x y z"');
    }

    return vec3(numbers[0], numbers[1], numbers[2]);
}

/**
 * Clear the console screen.
 */
function clearConsole() {
    const clearCommand = process.platform === 'win32' ? 'cls' : 'clear';
    spawnSync(clearCommand, { stdio: 'inherit' });
}

// Start the setting screen setup
setupSettingScreen();
