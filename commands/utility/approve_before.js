const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('approve_before')
		.setDescription('approves all users before a given timestamp.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addIntegerOption(option =>
			option
				.setName('timestamp')
				.setDescription('The unix timestamp in milliseconds before which to approve users')
				.setRequired(true)),
	async execute(interaction, bot_instance) {
		let timestamp = interaction.options.getInteger('timestamp');
		let count = await bot_instance.approve_all_before(timestamp);

		await interaction.reply({
			content: `Attempted to approve ${count} users. Verify actual role count.`,
			ephemeral: true,
		});
	},
};
