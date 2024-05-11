const {inRangeOfStasisChambers, searchStasisChambers} = require("../utils");

function setupPhysicTick (instance, stasisChambers, playerPearl) {
    instance.on('physicTick', () => {
        if (instance.entity !== null && inRangeOfStasisChambers(stasisChambers, instance)) {
            for (let id in playerPearl) {
                const pearl = Object.values(instance.entities).find((entity) => entity.id === id);
                if (pearl !== undefined && searchStasisChambers([pearl.position], stasisChambers) === null) {
                    delete playerPearl[id];
                }
            }
        }
    });
}

module.exports = setupPhysicTick;
