const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = (exceptions = []) => {
	const localCommands = [];

	const commandCategories = getAllFiles(
		path.join(__dirname, '../', 'commands'),
		true,
	);

	for (const commandCategory of commandCategories) {
		const commandFiles = getAllFiles(commandCategory);

		for (const commandFile of commandFiles) {
			const commandOject = require(commandFile);
			if (exceptions.includes(commandOject.name)) {
				continue;
			}
			localCommands.push(commandOject);
		}
	}

	return localCommands;
};