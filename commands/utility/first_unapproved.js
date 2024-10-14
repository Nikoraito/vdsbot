const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('first_unapproved')
		.setDescription('returns the join timestamp of the oldest unapproved user.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction, bot_instance) {
		let oldest_user = await bot_instance.get_first_unapproved();
		await interaction.reply({
			content: `The oldest unapproved member is **${oldest_user.user.username} (${oldest_user.user.id})** who joined at timestamp \`${oldest_user.joinedAt}\``,
			ephemeral: true,
		});
	},
};