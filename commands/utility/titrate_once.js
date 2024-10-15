const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { logger } = require('../../logging');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('titrate_once')
		.setDescription('Approves a count of users starting from the oldest.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addIntegerOption(option =>
			option
				.setName('count')
				.setDescription('The number of users to titrate with the approval role')
				.setRequired(true)),
	async execute(interaction, bot_instance) {
		let count_desired = interaction.options.getInteger('count');
		let count_attempted = await bot_instance.titrate(count_desired);
		let content = `Attempted to approve ${count_attempted} users. Verify actual role count.`
		logger.info(content);
		await interaction.reply({
			content,
			ephemeral: false,
		});
	},
};
