/* eslint-disable no-unused-vars */
const { Client, Interaction, EmbedBuilder } = require('discord.js');
const { lyricsExtractor } = require('@discord-player/extractor');
const { useQueue } = require('discord-player');

module.exports = {
	/**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
	callback: async (client, interaction) => {
		const queue = useQueue(interaction.guild.id);
		const lyricsFinder = lyricsExtractor();

		await interaction.deferReply();

		const lyrics = await lyricsFinder.search(queue.currentTrack.title).catch(() => null);
		if (!lyrics) return interaction.followUp({ content: 'No lyrics found', ephemeral: true });

		const trimmedLyrics = lyrics.lyrics.substring(0, 1997);

		const embed = new EmbedBuilder()
			.setTitle(lyrics.title)
			.setURL(lyrics.url)
			.setThumbnail(lyrics.thumbnail)
			.setAuthor({
				name: lyrics.artist.name,
				iconURL: lyrics.artist.image,
				url: lyrics.artist.url,
			})
			.setDescription(trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics)
			.setColor('Yellow');

		return interaction.followUp({ embeds: [embed] });
	},

	name: 'lyrics',
	description: 'Gets the lyrics to the current playing song.',
};