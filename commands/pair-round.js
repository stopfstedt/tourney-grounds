const { SlashCommandBuilder } = require('discord.js');
const  { print, parse, pair, help } = require('../lib/pair-round');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pair-round')
    .setDescription('Randomly pairs players on two given teams.')
    .addStringOption(option =>
      option.setName('input')
        .setDescription('The teams and their players.')
    ),
  async execute(interaction) {
    const value = interaction.options.getString('input');
    if (!value) {
      return interaction.reply(help());
    }
    try {
       const teams = parse(value);
       interaction.reply("```\n" + print(pair(teams)) + "\n```");
    } catch(e) {
      return interaction.reply(`**Input Error:**\n${e.message}\n` + help());
    }
  },
}
