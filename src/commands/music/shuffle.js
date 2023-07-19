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

		interaction.reply('**Shuffled the current queue!**');
	},

	name: 'shuffle',
	description: 'Shuffles the current playing queue.',
};