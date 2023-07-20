/* eslint-disable no-unused-vars */
const { Client, Interaction, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
	/**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
	callback: async (client, interaction) => {
		const queue = useQueue(interaction.guild.id);
		const tracks = queue.tracks.toArray();
		const currentTrack = queue.currentTrack;

		const reply = new EmbedBuilder()
			.setColor('DarkBlue')
			.setTitle('Queue')
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
			.setDescription(`Playing **${currentTrack.title}**`)
			.addFields(
				{ name: 'Up Next', value: tracks.slice(0, 5).map((track, index) => `${index + 1}. ${track.title}`).join('\n') },
			)
			.setFooter({ text: 'Powered by discord-player', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
		return interaction.reply({ embeds: [reply] });
	},

	name: 'queue',
	description: 'Shows the current queue.',
};