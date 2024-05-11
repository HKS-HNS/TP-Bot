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

        for (let id in playerPearl) {
            if (!Object.values(instance.entities).some((entity) => entity.id === id) && inRangeOfStasisChambers(stasisChambers, instance)) {
                delete playerPearl[id];
            }
        }
    });
}


module.exports = { setupSpawnEvents }