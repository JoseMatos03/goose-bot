require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const { Player } = require('discord-player');
const eventHandler = require('./handlers/eventHandler');

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildVoiceStates,
	],
});

const player = new Player(client);
player.extractors.loadDefault();
client.player = player;

eventHandler(client);

client.login(process.env.CLIENT_TOKEN);