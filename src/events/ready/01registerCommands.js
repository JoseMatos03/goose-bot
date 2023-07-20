const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');
const areCommandsDifferent = require('../../utils/areCommandsDifferent');

module.exports = async (client) => {
	const localCommands = getLocalCommands();
	client.guilds.cache.map(async guild => {
		try {
			const applicationCommands = await getApplicationCommands(
				client,
				guild.id,
			);

			for (const localCommand of localCommands) {
				const { name, description, options } = localCommand;
				const existingCommand = await applicationCommands.cache.find(
					(cmd) => cmd.name === name,
				);

				if (existingCommand) {
					if (localCommand.deleted) {
						await applicationCommands.delete(existingCommand.id);
						console.log(`🗑️ Deleted command: ${name} on server ${guild.name}`);
						continue;
					}

					if (areCommandsDifferent(existingCommand, localCommand)) {
						await applicationCommands.edit(existingCommand.id, {
							description,
							options,
						});

						console.log(`🔄 Updated command: ${name} on server ${guild.name}`);
					}
				}
				else {
					if (localCommand.deleted) {
						console.log(
							`⏩ Skipping registration of command ${name} as it's set to delete.`,
						);
						continue;
					}

					await applicationCommands.create({
						name,
						description,
						options,
					});

					console.log(`✅ Registered command: ${name} on server ${guild.name}`);
				}
			}
		}
		catch (error) {
			console.log(`Error registering commands: ${error} on server ${guild.name}`);
		}
	});
	console.log('👌 Registered all commands!');
};