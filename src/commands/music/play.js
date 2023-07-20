/* eslint-disable no-unused-vars */
const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

async function handleSongQuery(client, interaction, queue, channel, songQuery) {
	await client.player.search(songQuery)
		.then(async data => {
			const track = data.tracks[0];
			queue.addTrack(track);
			if (!queue.connection) await queue.connect(channel);
			if (!queue.isPlaying()) await queue.node.play();
			return interaction.followUp(`**${track.title}** enqueued!`);
		});
}

async function handlePlaylistQuery(client, interaction, queue, channel, playlistQuery) {
	// Search for the playlist, and add all songs to the queue
	await client.player.search(playlistQuery)
		.then(async data => {
			const tracks = data.tracks;
			tracks.forEach(track => {
				queue.addTrack(track);
			});
			if (!queue.connection) await queue.connect(channel);
			if (!queue.isPlaying()) await queue.node.play();

			// TODO: Add spotify integration
			const reply = new EmbedBuilder()
				.setColor(0x0099FF)
				.setTitle('Playlist enqueued!')
				.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
				.setDescription(`**${tracks.length}** songs added to the queue!`)
				.setThumbnail(tracks[0].thumbnail)
				.addFields(
					{ name: 'Playlist', value: `[${data.playlist.name}](${playlistQuery})` },
					{ name: 'Duration', value: `${data.playlist.duration}` },
				)
				.setFooter({ text: 'Powered by discord-player', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
			return interaction.followUp({ embeds: [reply] });
		});
}

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
		if (songQuery) handleSongQuery(client, interaction, queue, channel, songQuery);

		// Case 2: A link to a playlist is provided
		if (playlistQuery) handlePlaylistQuery(client, interaction, queue, channel, playlistQuery);

		// Case 3: No song or playlist is provided
		if (!songQuery && !playlistQuery) return interaction.followUp('You must provide a song or playlist!');
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