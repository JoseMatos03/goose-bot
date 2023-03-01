module.exports = {
    name: "ping",
    description: "Pong!",
    // devOnly: Boolean,
    // testOnly: Boolean,
    // options: Array,
    // deleted: Boolean,

    callback: (client, interaction) => {
        interaction.reply(`Pong! ${client.ws.ping}ms`);
    }
}