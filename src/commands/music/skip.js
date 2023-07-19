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

		interaction.reply('**Skipped to the next track!**');
	},

	name: 'skip',
	description: 'Skips to the next track on the queue.',
};