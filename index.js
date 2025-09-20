// @ts-nocheck
const qrcode = require('qrcode-terminal');
const { MessageMedia } = require('whatsapp-web.js');
const { client, clientId, sahilChatId, handleHealthCheckPingMessage } = require('./wwebclient');
const { preventPunyCodeWarning, logMessageReceived, logMessageSend } = require('./log-utils');
require('dotenv').config(); // This must be caled before aiAgents because that file reads environment variables.
const { handleMessageBySalesman, GOOGLE_API_KEY } = require('./aiAgents');

preventPunyCodeWarning();

// ✅ This is to make sure I use my own number for testing.
if (clientId !== 'sahil') { throw "❌Please use sahil's clientId."; }

// Guide: https://wwebjs.dev
// API Docs: https://docs.wwebjs.dev

// https://chatgpt.com/c/68a4b1a7-5644-8327-8841-d09136f3db7d

// ! TODO: Detect when the message is successfully delivered or read. 
// 			(check with ChatGPT, also this idea is from ChatGPT itself).

client.on('qr', (qr) => {
	// console.log('QR RECEIVED', qr)
	// * Nowonwards, QR code will be regenerated every 30 seconds until it's scanned with your mobile device. (src: https://wwebjs.dev/guide/creating-your-bot/#qr-code-generation)
	qrcode.generate(qr, { small: true });
});

// https://wa.me/918360267243?text=hello%20world

client.on('ready', async () => {
	console.log('Client is ready!');
	// ✅ Learn: Sets "About" text of user
	// client.setStatus('hello world...'); // [Tested] 

	// ✅ Learn: Send typing state (default for 25 seconds) and then clear it after 3 seconds [TESTED]
	// const chat = await client.getChatById(sahilChatId);
	// await chat.sendStateTyping();
	// setTimeout(async () => { await chat.clearState(); }, 3_000);

	//  ✅ Send message on startup...
	// client.sendMessage(sahilChatId, "Hello, I am ready to help you! (automated message from the bot).");
});

const MESSAGE = 'I am Sahil, how can I help you?';
const IMAGE_URL = 'https://avatars.githubusercontent.com/u/31458531';

// ❤️ Emitted when a new message is received.
client.on('message', async (message) => {
	logMessageReceived(message);
	handleHealthCheckPingMessage(message); // reply to any other user's !ping command

	const isFromSpecificNumber = message.from === '****8';
	if (isFromSpecificNumber) {
		await handleMessageBySalesman(message);
	}

	if (isGreeting(message.body)) {
		// Learn: 1. Reply method
		// await message.reply(MESSAGE)
		// console.log(`::replied with:: \`${MESSAGE}\n`)

		const chat = await message.getChat();				// way 1

		// Learn: 2. Send simple message with chatId
		// await chat.sendMessage('Hello, how are you?'); 					// way 1
		// await client.sendMessage(message.from, "Hello back!");			// way 2

		// Learn: 3. Attachment from file [TESTED]
		// 	❤️ Docs: https://wwebjs.dev/guide/creating-your-bot/handling-attachments.html
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

// ❤️ Emitted when a new message is created, which may include the current user's own messages.
client.on('message_create', async (message) => {  // src: https://chatgpt.com/c/68bdc513-35b0-832b-83dd-32b11a324bbe 
	if (message.fromMe) { // Only handle messages sent by you (not incoming)
		logMessageSend(message);
		await handleMessageBySalesman(message);

		// Message Deletion
		// Delete for everyone and shows generic "You deleted this message" greyed out message.
		if (message.body === '1') { setTimeout(() => message.delete(true), 500); }
		// Delete for me only (Note: The message stays on other user's chat)
		if (message.body === '2') { setTimeout(() => message.delete(), 500); }

		handleHealthCheckPingMessage(message); // reply to my own !ping command
	}
});

client.initialize();

function isGreeting(message) {
	const found = ['hi', 'hello', 'namaste'].find((t) => message.toLowerCase() === t);
	return Boolean(found);
}
