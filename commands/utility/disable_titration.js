const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('disable_titration')
		.setDescription('Halts titration process.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction, bot_instance) {
		
		bot_instance.disable_titration();

		await interaction.reply({
			content: `Titration disabled.`,
			ephemeral: true,
		});
	},
};
