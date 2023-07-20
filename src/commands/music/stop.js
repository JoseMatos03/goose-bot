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
		queue.delete();

		const reply = new EmbedBuilder()
			.setColor('DarkRed')
			.setTitle('Stopped!')
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
			.setDescription('Stopped the player and deleted all queues.')
			.setFooter({ text: 'Powered by discord-player', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
		return interaction.reply({ embeds: [reply] });
	},

	name: 'stop',
	description: 'Stops the player and delete all queues.',
};