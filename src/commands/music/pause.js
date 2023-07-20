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
		// isPaused() returns true if that player is already paused
		queue.node.setPaused(!queue.node.isPaused());

		const reply = new EmbedBuilder()
			.setColor('Red')
			.setTitle('Paused!')
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
			.setDescription('Paused the player!')
			.setFooter({ text: 'Powered by discord-player', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
		return interaction.reply({ embeds: [reply] });
	},

	name: 'pause',
	description: 'Pauses the player.',
};