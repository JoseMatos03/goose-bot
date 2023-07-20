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
		queue.node.skip();

		const reply = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Skipped!')
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
			.setDescription(`Now playing: **${queue.tracks.at(0).title}**`)
			.setFooter({ text: 'Powered by discord-player', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
		return interaction.reply({ embeds: [reply] });
	},

	name: 'skip',
	description: 'Skips to the next track on the queue.',
};