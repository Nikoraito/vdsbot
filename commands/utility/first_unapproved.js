const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('first_unapproved')
		.setDescription('returns the join timestamp of the oldest unapproved user.'),
	async execute(interaction, bot) {
		await interaction.reply(bot.wave_period);
	},
};

