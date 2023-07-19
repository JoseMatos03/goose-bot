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

		interaction.reply('**Paused the player!**');
	},

	name: 'pause',
	description: 'Pauses the player.',
};