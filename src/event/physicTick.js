const {inRangeOfStasisChambers, searchStasisChambers} = require("../utils");

function setupPhysicTick (instance, stasisChambers, playerPearl) {
    instance.on('physicTick', () => {
        if (instance.entity !== null && inRangeOfStasisChambers(stasisChambers, instance)) {
            for (let uuid in playerPearl) {
                const pearl = Object.values(instance.entities).find((entity) => entity.uuid === uuid);
                if (pearl !== undefined && searchStasisChambers([pearl.position], stasisChambers) === null) {
                    delete playerPearl[uuid];
                }
            }
        }
    });
}

module.exports = setupPhysicTick;
