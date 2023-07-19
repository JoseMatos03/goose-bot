const {
	ApplicationCommandOptionType,
} = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
	/**
     *
     * @param {Client} client The discord bot client
     * @param {Interaction} interaction The interaction (message) that triggered the command
     */
	callback: async (client, interaction) => {
		// Check if the user is in a voice channel
		const channel = interaction.member.voice.channel;
		if (!channel) return interaction.reply('You are not connected to a voice channel!');

		// Check if the bot has a queue created already for the guild
		if (!useQueue(interaction.guild.id)) client.player.nodes.create(interaction.guild.id);
		const queue = useQueue(interaction.guild.id);

		// Get the song and playlist options
		const songQuery = interaction.options.get('song')?.value;
		const playlistQuery = interaction.options.get('playlist')?.value;

		// Defers the response, as the bot is doing something that takes a while
		await interaction.deferReply();

		// Case 1: A single song is provided
		if (songQuery) {
			// Search for the song, and add it to the queue
			await client.player.search(songQuery)
				.then(async data => {
					const track = data.tracks[0];
					queue.addTrack(track);
					if (!queue.connection) await queue.connect(channel);
					if (!queue.isPlaying()) await queue.node.play();
					return interaction.followUp(`**${track.title}** enqueued!`);
				});
		}

		// Case 2: A link to a playlist is provided
		if (playlistQuery) {
			// Search for the playlist, and add all songs to the queue
			await client.player.search(playlistQuery)
				.then(async data => {
					const tracks = data.tracks;
					tracks.forEach(track => {
						queue.addTrack(track);
					});
					if (!queue.connection) await queue.connect(channel);
					if (!queue.isPlaying()) await queue.node.play();
					return interaction.followUp('Playlist enqueued!');
				});
		}

		// Case 3: No song or playlist is provided
		if (!songQuery && !playlistQuery) {
			return interaction.followUp('You must provide a song or playlist!');
		}
	},

	name: 'play',
	description: 'Play any song or playlist.',
	options: [
		{
			name: 'song',
			description: 'Any form of **single** song input (search/link).',
			type: ApplicationCommandOptionType.String,
			required: false,
		},
		{
			name: 'playlist',
			description: 'A link to a spotify playlist.',
			type: ApplicationCommandOptionType.String,
			required: false,
		},
	],
};