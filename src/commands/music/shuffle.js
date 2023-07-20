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
		queue.tracks.shuffle();

		const reply = new EmbedBuilder()
			.setColor('DarkBlue')
			.setTitle('Shuffled!')
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
			.setDescription('Shuffled the current queue!')
			.setFooter({ text: 'Powered by discord-player', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
		return interaction.reply({ embeds: [reply] });
	},

	name: 'shuffle',
	description: 'Shuffles the current playing queue.',
};