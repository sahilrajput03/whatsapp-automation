const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

// By Default it uses a persistent storage to store the session, yikes!
const client = new Client({
	authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
	// console.log('QR RECEIVED', qr)
	qrcode.generate(qr, { small: true });
});

// https://wa.me/918360267243?text=hello%20world

client.on('ready', () => {
	console.log('Client is ready!');

	//  ✅ Send message on startup...
	// const ratanNumber = "918699621565";
	// const sahilNumber = "918360267243";
	// const himanshuNumber = "918847037612";
	// const chatId = ratanNumber + "@c.us";
	// client.sendMessage(chatId, "Hello, I am ready to help you! (automated message from the bot).");
});

const MESSAGE = 'I am Sahil, how can I help you?';
const IMAGE_URL = 'https://avatars.githubusercontent.com/u/31458531';

client.on('message', async (message) => {
	console.log('::RECEIVED::', message.body);
	console.log('::FROM::', message.from);
	if (isGreeting(message.body)) {
		// Learn: 1. Reply method
		// await message.reply(MESSAGE)
		// console.log(`::replied with:: \`${MESSAGE}\n`)

		// Learn: 2. Or use sendMessage with chatId
		// await client.sendMessage(message.from, "Hello back!");

		// Learn: 3. Attachment from file [TESTED]
		let chat = await message.getChat();
		const media1 = await MessageMedia.fromFilePath('./profile.png');
		await chat.sendMessage(media1, { caption: MESSAGE });

		// Learn: 4. Attachment from url
		// const media = await MessageMedia.fromUrl('https://via.placeholder.com/350x150.png')
		// await chat.sendMessage(media)
	}
});

// LEARN:
// let chat = await getChatById(chatId)

client.initialize();

function isGreeting(message) {
	const found = ['hi', 'hello', 'namaste'].find((t) => message.toLowerCase() === t);
	return Boolean(found);
}
