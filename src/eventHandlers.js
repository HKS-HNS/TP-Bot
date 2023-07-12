
let pearlPlayer ={}

function HandleWhisperEvent (instance, username, message){
    if(username === instance.username) return;
    if(message === "hi"){
        instance.whisper(username,"hi")
    }

}

function HandleSpawnEntityEvent (instance, data, packetMeta) {
    // 28 is the ID of the ender pearl
    if(packetMeta.name === "spawn_entity" && data.type === 28){
        //pearlPlayer[data.entityId] = data.objectData;
        console.log(data)
        console.log(instance.entities[data.objectData.toString()]);

    }
}

//e3d40445-144c-4ef2-8a14-4ec037dca232

module.exports = {
    HandleWhisperEvent,
    HandleSpawnEntityEvent}