// Dependencies
const { Embed } = require('../../utils'),
	{ time: { getReadableTime } } = require('../../utils'),
	Command = require('../../structures/Command.js');

module.exports = class Uptime extends Command {
	constructor(bot) {
		super(bot, {
			name: 'uptime',
			dirname: __dirname,
			botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS'],
			description: 'Gets the uptime of the bot.',
			usage: 'uptime',
			cooldown: 2000,
			slash: true
		});
	}

	// Run command
	async run(bot, message) {
		const embed = new Embed(bot, message.guild)
			.setDescription(message.translate('misc/uptime:DESC', { TIME: getReadableTime(bot.uptime) }));
		message.channel.send(embed);
	}

	//Run slash command
	async callback(bot, interaction, guild) {
		const embed = new Embed(bot, guild)
			.setDescription(bot.translate('misc/uptime:DESC', { TIME: getReadableTime(bot.uptime) }));
		return bot.send(interaction, embed)
	}
};
