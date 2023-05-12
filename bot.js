const mineflayer = require('mineflayer')
const autoEat = require("mineflayer-auto-eat")
const vec3 = require('vec3')
const instance = mineflayer.createBot({
    host: credentials[0],
    port: 25565,
    username: credentials[1],
    password: credentials[2],
    version: "1.18.2",
    auth: 'microsoft'
})