const {
	ApplicationCommandOptionType,
	PermissionFlagsBits,
} = require('discord.js');
const ms = require('ms');

module.exports = {
	/**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
	callback: async (client, interaction) => {
		const mentionable = interaction.options.get('user').value;
		const duration = interaction.options.get('duration').value;
		const reason =
        interaction.options.get('reason')?.value || 'No reason given';

		await interaction.deferReply();

		const targetUser = await interaction.guild.members.fetch(mentionable);
		if (!targetUser) {
			await interaction.editReply('User not found.');
			return;
		}
		if (targetUser.user.bot) {
			await interaction.editReply('You cannot timeout a bot.');
			return;
		}

		const msDuration = ms(duration);
		if (isNaN(msDuration)) {
			await interaction.editReply('Invalid duration.');
			return;
		}
		if (msDuration < 5000 || msDuration > 2.419e9) {
			await interaction.editReply(
				'Duration must be between 5 seconds and 28 days.',
			);
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
				'You cannot timeout a user with a higher or equal role than you.',
			);
			return;
		}

		if (targetUserRolePosition >= botRolePosition) {
			await interaction.editReply(
				'I cannot timeout a user with a higher or equal role than me.',
			);
			return;
		}

		// Timeout the user
		try {
			const { default: prettyMs } = await import('pretty-ms');

			if (targetUser.isCommunicationDisabled()) {
				await targetUser.timeout(msDuration, reason);
				await interaction.editReply(
					`${targetUser}'s timeout has been extended to ${prettyMs(msDuration, {
						verbose: true,
					})} for ${reason}`,
				);
				return;
			}

			await targetUser.timeout(msDuration, reason);
			await interaction.editReply(
				`${targetUser} has been timed out for ${reason} for ${prettyMs(
					msDuration,
					{ verbose: true },
				)}`,
			);
		}
		catch (error) {
			console.log(`There was an error when timing out: ${error}`);
			await interaction.editReply(
				'An error occurred while trying to timeout the user.',
			);
			return;
		}
	},

	name: 'timeout',
	description: 'Timeout a user',
	options: [
		{
			name: 'user',
			description: 'The user to timeout',
			type: ApplicationCommandOptionType.Mentionable,
			required: true,
		},
		{
			name: 'duration',
			description: 'Timeout duration (30min, 1h, 1d)',
			type: ApplicationCommandOptionType.String,
			required: true,
			choices: [
				{
					name: '1 minute',
					value: '1m',
				},
				{
					name: '5 minutes',
					value: '5m',
				},
				{
					name: '10 minutes',
					value: '10m',
				},
				{
					name: '30 minutes',
					value: '30m',
				},
				{
					name: '1 hour',
					value: '1h',
				},
				{
					name: '1 day',
					value: '1d',
				},
			],
		},
		{
			name: 'reason',
			description: 'The reason for the timeout',
			type: ApplicationCommandOptionType.String,
			required: false,
		},
	],
	permissionsRequired: [PermissionFlagsBits.MuteMembers],
	botPermissions: [PermissionFlagsBits.MuteMembers],
};