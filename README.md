# TP-Bot Documentation

## Introduction

TP-Bot is a Mineflayer bot designed to interact with a Minecraft server using the Mineflayer library. This documentation provides a guide on how to set up and use TP-Bot to connect to your Minecraft server and perform various tasks.

## Prerequisites

Before using TP-Bot, make sure you have the following:

1. Node.js installed on your system.
2. Access to a Minecraft server running the version specified in the `minecraftVersion` setting (e.g., 1.20.1).

## Installation

1. Clone or download the TP-Bot repository from [GitHub](https://github.com/yourusername/tp-bot-reloaded).

2. Navigate to the TP-Bot directory using the command line or terminal:

   ```bash
   cd TP-Bot
   ```

3. Install the required dependencies by running:

   ```bash
   npm install
   ```

## Configuration

The configuration for TP-Bot is stored in the `settings.json` file. You must provide the necessary details in this file before running the bot. Here is an explanation of each setting:

- `serverPort`: The port number of your Minecraft server. Default is `25565`.
- `minecraftVersion`: The version of Minecraft your server is running on (e.g., `1.20.1`).
- `chatSigning`: Set to `true` if you want to enable chat signing, otherwise set to `false`.
- `username`: The Minecraft account email or username that TP-Bot will use to log in.
- `serverIP`: The IP address or hostname of the Minecraft server you want TP-Bot to connect to.
- `password`: The password for the Minecraft account specified in the `username` setting.

Edit the `settings.json` file with the appropriate values:

```json
{
  "serverPort": "25565",
  "minecraftVersion": "1.20.1",
  "chatSigning": "false",
  "username": "some@mail.com",
  "serverIP": "localhost",
  "password": "123"
}
```
To set the Chambers you have to run:
```bash
node src/settings.js
```

## Usage

To start TP-Bot, run the following command in the TP-Bot directory:

```bash
node src/index.js
```

The bot will connect to the specified Minecraft server using the provided credentials. Once connected, TP-Bot can perform various tasks, depending on the functionality you implement in the `index.js` file.

## Extending TP-Bot

You can extend TP-Bot's capabilities by editing the `index.js` file. The `Mineflayer` library provides various methods for interacting with the Minecraft world, players, and chat. Refer to the [Mineflayer documentation](https://github.com/PrismarineJS/mineflayer) for more details.

In the `index.js` file, you can add event listeners and custom functions to handle different events and perform specific actions in the Minecraft server.

```javascript
const mineflayer = require('mineflayer');
const bot = mineflayer.createBot({
  host: "localhost",
  port: 25565,
  username: "some@mail.com",
  password: "123",
  version: "1.19.2",
  chat: false, // Set to true if you want to enable chat signing
  // Add additional options here as needed
});

// Example: Respond to a player's chat message
bot.on('chat', (username, message) => {
  console.log(`${username} said: ${message}`);
  // Add your response logic here
});
```

## Conclusion

Congratulations! You have successfully set up and configured TP-Bot to connect to your Minecraft server. You can now extend its functionality to create a custom bot that interacts with the Minecraft world and players. For further development, explore the Mineflayer documentation and experiment with different features and event listeners.

If you encounter any issues or have any questions, please refer to the TP-Bot repository on GitHub for support and updates.

Happy botting in Minecraft with TP-Bot! 🚀
