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
			await interaction.editReply('You cannot kick the server owner.');
			return;
		}

		if (targetUser.id === client.user.id) {
			await interaction.editReply('You cannot kick me.');
			return;
		}

		if (targetUser.id === interaction.user.id) {
			await interaction.editReply('You cannot kick yourself.');
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
				'You cannot kick a user with a higher or equal role than you.',
			);
			return;
		}

		if (targetUserRolePosition >= botRolePosition) {
			await interaction.editReply(
				'I cannot kick a user with a higher or equal role than me.',
			);
			return;
		}

		// Kick the target user
		try {
			await targetUser.kick(reason);
			await interaction.editReply(
				`Successfully kicked \`${targetUser.user.tag}\` for \`${reason}\``,
			);
		}
		catch (error) {
			console.log(`There was an error while trying to kick a user ${error}`);
			await interaction.editReply('An error occurred while kicking the user.');
			return;
		}
	},

	name: 'kick',
	description: 'Kicks a user from the server.',
	options: [
		{
			name: 'user',
			description: 'The user to kick.',
			type: ApplicationCommandOptionType.Mentionable,
			required: true,
		},
		{
			name: 'reason',
			description: 'The reason for the kick.',
			type: ApplicationCommandOptionType.String,
			required: false,
		},
	],
	permissionsRequired: [PermissionFlagsBits.KickMembers],
	botPermissions: [PermissionFlagsBits.KickMembers],
};