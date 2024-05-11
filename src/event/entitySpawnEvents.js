const mcData = require("minecraft-data");
const {isUUID} = require("../utils");
function setupEntitySpawnEvents(instance, playerPearl) {
        instance._client.on('spawn_entity', (data) => {
        if (data.type === mcData(instance.version).entitiesByName['ender_pearl'].id) {
            setTimeout(() => {
                if (data.entityId === 0) return;
                // Check if the entity exists in the 'entities' object
                if (instance.entities[data.objectData.toString()] === undefined && !isUUID(playerPearl[data.entityId])) {
                    playerPearl[data.entityId] = data.objectData;
                } else if (instance.entities[data.objectData] !== undefined) {
                    playerPearl[data.entityId] = instance.entities[data.objectData].uuid;
                }
            }, 10);
        }
    });

    instance.on('entitySpawn', (entity) => {
        // Check if the entity is a player
        Object.keys(playerPearl).forEach((key) => {
            const uuid = Object.keys(playerPearl).find((playerKey) => playerPearl[playerKey] === entity.id);
            if (uuid !== undefined) {
                playerPearl[key] = entity.uuid;
            }
        });
    });



}

module.exports = { setupEntitySpawnEvents }