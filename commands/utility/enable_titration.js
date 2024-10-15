const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { logger } = require('../../logging');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('enable_titration')
		.setDescription('Approves a count of users starting from the oldest.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addIntegerOption((option) =>
			option
				.setName('desired_count')
				.setDescription(
					'The number of users to attempt to grant the approval role (default 10 users)'
				)
				.setRequired(false)
		)
		.addIntegerOption((option) =>
			option
				.setName('period')
				.setDescription(
					'The time interval between titrations in seconds (default 1h)'
				)
				.setRequired(false)
		),
	async execute(interaction, bot_instance) {
		let desired_count =
			interaction.options.getInteger('desired_count') ??
			bot_instance.max_ingresses_per_period;
		let period =
			interaction.options.getInteger('period') ??
			bot_instance.wave_period_seconds;

		await bot_instance.enable_titration(desired_count, period);
		let unapproved_count = await bot_instance.get_unapproved_count();
		let estimated_minutes = (unapproved_count / desired_count) * (period / 60);
		let content = `Initiating approval titration at a rate of ${desired_count} users / ${period} seconds.
			_The server contains ${unapproved_count} unapproved users, so it will take approximately ${estimated_minutes} minutes (${
			estimated_minutes / 60
		} hr.) to complete_`;
		logger.info(content);
		await interaction.reply({
			content,
			ephemeral: false,
		});
	},
};
