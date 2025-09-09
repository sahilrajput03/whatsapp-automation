const qrcode = require('qrcode-terminal');
const { MessageMedia } = require('whatsapp-web.js');
const { client } = require('./wwebclient');
const { preventPunyCodeWarning } = require('./log-utils');

preventPunyCodeWarning();

// https://chatgpt.com/c/68a4b1a7-5644-8327-8841-d09136f3db7d

// ! TODO: Detect when the message is successfully delivered or read. 
// 			(check with ChatGPT, also this idea is from ChatGPT itself).

client.on('qr', (qr) => {
	// console.log('QR RECEIVED', qr)
	qrcode.generate(qr, { small: true });
});

// https://wa.me/918360267243?text=hello%20world

client.on('ready', () => {
	console.log('Client is ready!');

	//  ✅ Send message on startup...
	const ratanNumber = "918699621565"; const sahilNumber = "918360267243"; const himanshuNumber = "918847037612";
	const chatId = sahilNumber + "@c.us";
	client.sendMessage(chatId, "Hello, I am ready to help you! (automated message from the bot).");
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

		const chat = await message.getChat();				// way 1

		// Learn: 2. Send simple message with chatId
		// await chat.sendMessage('Hello, how are you?'); 					// way 1
		// await client.sendMessage(message.from, "Hello back!");			// way 2

		// Learn: 3. Attachment from file [TESTED]
		const media1 = await MessageMedia.fromFilePath('./profile.png');
		await chat.sendMessage(media1, { caption: MESSAGE });
		// await chat.sendMessage('hello world??'); // ! TESTING

		// Learn: 4. Attachment from url
		// const media = await MessageMedia.fromUrl('https://via.placeholder.com/350x150.png')
		// await chat.sendMessage(media)
	}
});

//   Learn:
// const chat = await client.getChatById(message.from)	// way 2

client.on('message_create', (message) => {  // src:https://chatgpt.com/c/68bdc513-35b0-832b-83dd-32b11a324bbe 
	if (message.fromMe) { // Only handle messages sent by you (not incoming)
		console.log('🚀 YOU SENT A MESSAGE:', message.body);
	}
});

client.initialize();

function isGreeting(message) {
	const found = ['hi', 'hello', 'namaste'].find((t) => message.toLowerCase() === t);
	return Boolean(found);
}
