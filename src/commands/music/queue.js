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

		interaction.reply(`${tracks}\nPlaying ${currentTrack}!`);
	},

	name: 'queue',
	description: 'Shows the current queue.',
};