const { useQueue } = require('discord-player');

module.exports = {
	/**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
	callback: async (client, interaction) => {
		const queue = useQueue(interaction.guild.id);
		queue.node.resume();

		interaction.reply('**Resumed!**');
	},

	name: 'resume',
	description: 'Resumes the player.',
};