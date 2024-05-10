const {Movements} = require("mineflayer-pathfinder");
const mcData = require("minecraft-data");
const {inRangeOfStasisChambers} = require("../utils");

function setupSpawnEvents(instance, playerPearl, stasisChambers) {
    instance.on('spawn', () => {
        const defaultMove = new Movements(instance, mcData(instance.version));
        defaultMove.canDig = false;
        defaultMove.allow1by1towers = false;
        instance.pathfinder.setMovements(defaultMove);
        //isConnected = true;
        instance.autoEat.options = {
            priority: 'saturation',
            bannedFood: []
        };

        for (let uuid in playerPearl) {
            if (!Object.values(instance.entities).some((entity) => entity.uuid === uuid) && inRangeOfStasisChambers(stasisChambers, instance)) {
                delete playerPearl[uuid];
            }
        }
    });
}


module.exports = { setupSpawnEvents }