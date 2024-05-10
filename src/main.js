const { setupBot } = require('./setupBot');
const { createBot } = require('./botManager');

async function main() {
    try {
        const config = await setupBot();
        const bot = createBot(config);
        // You can add additional bot logic here or in the botManager
    } catch (error) {
        console.error('Failed to setup or create bot:', error);
    }
}

main();
