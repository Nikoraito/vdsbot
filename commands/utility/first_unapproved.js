const { SlashCommandBuilder, PermissionsBitField  } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('first_unapproved')
		.setDescription('returns the join timestamp of the oldest unapproved user.')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction, bot_instance) {
		let oldest_user = await bot_instance.get_first_unapproved();
		await interaction.reply(`The oldest unapproved member is **${oldest_user.user.globalName}** who joined at timestamp \`${oldest_user.joinedAt}\``);
	},
};

