const mineflayer = require('mineflayer');
const autoEat = require("mineflayer-auto-eat");
const fs = require('fs');
const {HandleWhisperEvent, HandleSpawnEntityEvent} = require("./eventHandlers.js")
const credentials = fs.readFileSync("../credentials.txt").toString().split("\n");
let isConnected = false;
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
        auth: 'microsoft'
    });
    bot = instance;

    instance.once('spawn', () => {
        isConnected = true
        instance.autoEat.options = {
            priority: 'saturation',
            bannedFood: []
        }
    })
    instance.loadPlugin(autoEat.plugin)
    // to the method whisper that has function HandleWhisperEvent (username, message, instance){
    instance.on('whisper', HandleWhisperEvent.bind(null, instance))

   instance._client.on('packet', HandleSpawnEntityEvent.bind(null, instance))



}


//e3d40445-144c-4ef2-8a14-4ec037dca232
connect();

