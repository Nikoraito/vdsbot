const { SlashCommandBuilder } = require('discord.js');
const { logger } = require('../../logging');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction, bot_instance) {
		logger.info('ping');
		await interaction.reply('Pong!');
	},
};