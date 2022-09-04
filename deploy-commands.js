if (!process.env.DISCORD_APPLICATION_ID) {
  console.log('Error: Specify DISCORD_APPLICATION_ID in environment');
  process.exit(1);
}
if (!process.env.DISCORD_BOT_TOKEN) {
  console.log('Error: Specify DISCORD_TOKEN in environment');
  process.exit(1);
}

const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');


const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

rest.put(Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
