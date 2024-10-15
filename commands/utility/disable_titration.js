const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { logger } = require('../../logging');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('disable_titration')
		.setDescription('Halts titration process.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction, bot_instance) {
		bot_instance.disable_titration();
		let content = `Titration disabled.`;
		logger.info(content);
		await interaction.reply({
			content,
			ephemeral: false,
		});
	},
};
