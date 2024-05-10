// pearlEvents.js

const mcData = require("minecraft-data");
const {activateEnderPearl} = require("../utils");

function setupChatEvents(instance) {

    instance._client.on("chat", (data) => {
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
    });

    instance.on('whisper', (username, message ) => {
        // Ignore if the whisper is sent by the bot itself
        if (username === instance.username) return;

        if (message.endsWith('tp')) {
            // Search for the UUID of the player sending the message in the 'playerPearl' object
            activateEnderPearl(playerPearl, stasisChambers, instance, instance.players[username].uuid);
        }
    });


}

module.exports = { setupChatEvents };
