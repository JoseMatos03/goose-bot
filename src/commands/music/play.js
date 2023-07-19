const {
	ApplicationCommandOptionType,
} = require('discord.js');
const { useQueue } = require('discord-player');


module.exports = {
	/**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
	callback: async (client, interaction) => {
		const channel = interaction.member.voice.channel;
		if (!channel) return interaction.reply('You are not connected to a voice channel!');
		const query = interaction.options.get('query')?.value;

		// let's defer the interaction as things can take time to process
		await interaction.deferReply();

		const queue = useQueue(interaction.guild.id);
		if (queue) {
			const track = await client.player.search(query);
			const trackTitle = track._data.tracks[0].title;
			queue.addTrack(track._data.tracks[0]);

			if (!queue.isPlaying()) await queue.node.play();
			return interaction.followUp(`**${trackTitle}** enqueued!`);
		}
		else {
			client.player.nodes.create(interaction.guild.id);
			const { track } = await client.player.play(channel, query);

			return interaction.followUp(`**${track.title}** enqueued!`);
		}
	},

	name: 'play',
	description: 'Play any song.',
	options: [
		{
			name: 'query',
			description: 'Any form of song input (search/link).',
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
};