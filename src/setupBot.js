const fs = require('fs').promises;

async function setupBot() {
    const inquirer = await import('inquirer');
    let config;

    // Check if the config file exists and ask the user if they want to use it
    try {
        const data = await fs.readFile('config.json', 'utf8');
        config = JSON.parse(data);

        const useSavedConfig = await inquirer.default.prompt({
            name: 'useSaved',
            type: 'confirm',
            message: 'Configuration file found. Would you like to use the saved configuration?'
        });

        if (useSavedConfig.useSaved) {
            return config;
        }
    } catch (error) {
        console.log('No existing configuration found or error reading file. Proceeding to manual setup.');
    }

    // Define questions for inquirer if not using saved config
    const questions = [
        {
            name: 'host',
            type: 'input',
            message: 'Enter server IP:',
            default: config?.host || 'localhost'  // Use saved data if available and not using it
        },
        {
            name: 'port',
            type: 'number',
            message: 'Enter server port:',
            default: config?.port || 25565,
            validate: value => !isNaN(parseFloat(value)) || 'Please enter a number',
            filter: Number
        },
        {
            name: 'username',
            type: 'input',
            message: 'Enter bot username or email:',
            default: config?.username  // Use saved data if available
        },
        {
            name: 'password',
            type: 'password',
            message: 'Enter password (leave blank if not applicable):',
            mask: '*',
            default: config?.password  // Use saved data if available
        },
        {
            name: 'auth',
            type: 'list',
            message: 'Select authentication type:',
            choices: ['mojang', 'microsoft'],
            default: config?.auth || 'mojang'  // Use saved data if available
        },
        {
            name: 'version',
            type: 'input',
            message: 'Enter the Minecraft version (leave blank for auto-detection):',
            default: config?.version || (() => false)  // Use saved data if available
        }
    ];

    // Prompt user for configuration
    const answers = await inquirer.default.prompt(questions);

    // Optionally save new configuration to a file
    await fs.writeFile('config.json', JSON.stringify(answers, null, 4));
    console.log('Configuration saved.');

    return answers;
}

module.exports = { setupBot };
