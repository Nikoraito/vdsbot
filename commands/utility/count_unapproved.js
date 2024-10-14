const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('count_unapproved')
		.setDescription('returns the count of users without the approval role.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction, bot_instance) {
		let oldest_user = await bot_instance.get_first_unapproved();
		let count_unapproved = await bot_instance.get_unapproved_count();
		let total_users = (await bot_instance.get_users()).size;
		await interaction.reply({
			content: 
`The server contains ${total_users} users, of which **${count_unapproved}** have not been approved.
The oldest unapproved member is **${oldest_user.user.username} (${oldest_user.user.id})**, 
who joined at \`${oldest_user.joinedAt}\` \`${oldest_user.joinedAt.getTime()}\``,
			ephemeral: true,
		});
	},
};
