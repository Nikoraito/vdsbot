const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('approve_before')
		.setDescription('approves all users before a given timestamp.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addIntegerOption(option =>
			option
				.setName('timestamp')
				.setDescription('The unix timestamp in milliseconds before which to approve users')),
	async execute(interaction, bot_instance) {
		let timestamp = interaction.options.getInteger('timestamp');
		let count = await bot_instance.approve_all_before(timestamp);

		await interaction.reply({
			content: `Approved ${count} users`,
			ephemeral: true,
		});
	},
};
