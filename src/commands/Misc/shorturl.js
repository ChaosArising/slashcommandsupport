// Dependencies
const { shorten } = require('tinyurl'),
	Command = require('../../structures/Command.js');

module.exports = class ShortURL extends Command {
	constructor(bot) {
		super(bot, {
			name: 'shorturl',
			dirname: __dirname,
			aliases: ['surl', 'short-url'],
			botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS'],
			description: 'Creates a shorturl on the URL you sent.',
			usage: 'shorturl',
			cooldown: 3000,
			examples: ['shorturl https://www.google.com', 'shorturl https://www.youtube.com'],
			slash: true,
			options: [{
                name: "url",
                description: "The specified URL to shorten.",
                type: 3,
                required: true
            }]
		});
	}

	// Run command
	async run(bot, message) {
		const mes = message.content.split(' ').slice(1).join(' ');

		// send 'waiting' message to show bot has recieved message
		const msg = await message.channel.send(message.translate('misc:FETCHING', {
			EMOJI: message.checkEmoji() ? bot.customEmojis['loading'] : '', ITEM: this.help.name }), { tts: true });

		try {
			shorten(mes, function(res) {
				msg.delete();
				message.channel.send(res);
			});
		} catch (err) {
			if (message.deletable) message.delete();
			bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
			msg.delete();
			message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }).then(m => m.delete({ timeout: 5000 }));
		}
	}
	async callback(bot, interaction, guild, args) {
		console.log(args)
		const channel = guild.channels.cache.get(interaction.channel_id)
		const link = args[0].value

		try {
			shorten(link, async function(res) {
				return await bot.send(interaction, res);
			});
		} catch (err) {
			bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
			return await bot.send(interaction, channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }).then(m => m.delete({ timeout: 5000 })));
		}
	}
};
