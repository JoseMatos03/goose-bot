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

		interaction.reply('**Stopped the player!**');
	},

	name: 'stop',
	description: 'Stops the player and delete all queues.',
};