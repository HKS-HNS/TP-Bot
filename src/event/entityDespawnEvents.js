const mcData = require("minecraft-data");
const {isUUID, inRangeOfStasisChambers} = require("../utils");

function setupEntityDespawnEvents(instance, stasisChambers, playerPearl) {

    instance.on('entityGone', (entity) => {
    if (entity.entityType === mcData(instance.version).entitiesByName['ender_pearl'].id && inRangeOfStasisChambers(stasisChambers, instance)) {
            delete playerPearl[entity.id];
        }
    });


}

module.exports = { setupEntityDespawnEvents }