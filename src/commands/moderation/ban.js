const {
	ApplicationCommandOptionType,
	PermissionFlagsBits,
} = require('discord.js');

module.exports = {
	/**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
	callback: async (client, interaction) => {
		const targetUserId = interaction.options.get('user').value;
		const reason =
        interaction.options.get('reason')?.value || 'No reason given';

		await interaction.deferReply();

		const targetUser = await interaction.guild.members.fetch(targetUserId);

		if (!targetUser) {
			await interaction.editReply('User not found.');
			return;
		}

		if (targetUser.id === interaction.guild.ownerId) {
			await interaction.editReply('You cannot ban the server owner.');
			return;
		}

		if (targetUser.id === client.user.id) {
			await interaction.editReply('You cannot ban me.');
			return;
		}

		if (targetUser.id === interaction.user.id) {
			await interaction.editReply('You cannot ban yourself.');
			return;
		}

		// Highest role position of the target user
		const targetUserRolePosition = targetUser.roles.highest.position;
		// Highest role position of the user who requested the ban
		const requestUserRolePosition = interaction.member.roles.highest.position;
		// Highest role position of the bot
		const botRolePosition = interaction.guild.me.roles.highest.position;

		if (targetUserRolePosition >= requestUserRolePosition) {
			await interaction.editReply(
				'You cannot ban a user with a higher or equal role than you.',
			);
			return;
		}

		if (targetUserRolePosition >= botRolePosition) {
			await interaction.editReply(
				'I cannot ban a user with a higher or equal role than me.',
			);
			return;
		}

		// Ban the target user
		try {
			await targetUser.ban({ reason });
			await interaction.editReply(
				`Successfully banned \`${targetUser.user.tag}\` for \`${reason}\``,
			);
		}
		catch (error) {
			console.log(`There was an error while trying to ban a user ${error}`);
			await interaction.editReply('An error occurred while banning the user.');
			return;
		}
	},

	name: 'ban',
	description: 'Bans a user from the server.',
	options: [
		{
			name: 'user',
			description: 'The user to ban.',
			type: ApplicationCommandOptionType.Mentionable,
			required: true,
		},
		{
			name: 'reason',
			description: 'The reason for the ban.',
			type: ApplicationCommandOptionType.String,
			required: false,
		},
	],
	permissionsRequired: [PermissionFlagsBits.BanMembers],
	botPermissions: [PermissionFlagsBits.BanMembers],
};