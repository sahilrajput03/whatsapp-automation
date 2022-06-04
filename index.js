const qrcode = require('qrcode-terminal')
const {Client, LocalAuth, MessageMedia} = require('whatsapp-web.js')
// By Default it uses a persistent storage to store the session, yikes!

const client = new Client({
	authStrategy: new LocalAuth(),
})

client.on('qr', (qr) => {
	// console.log('QR RECEIVED', qr)
	qrcode.generate(qr, {small: true})
})

client.on('ready', () => {
	console.log('Client is ready!')
})

const MESSAGE = 'I am Sahil, how can I help you?'
const IMAGE_URL = 'https://avatars.githubusercontent.com/u/31458531'

client.on('message', async (message) => {
	console.log('::got message::', message.body)
	if (interceptor(message.body)) {
		// await message.reply(MESSAGE)
		// console.log(`::replied with:: \`${MESSAGE}\n`)

		let chat = await message.getChat()

		// Attachment from file
		const media1 = await MessageMedia.fromFilePath('./profile.png')
		await chat.sendMessage(media1, {caption: MESSAGE})

		// Attachment from url
		// const media = await MessageMedia.fromUrl('https://via.placeholder.com/350x150.png')
		// await chat.sendMessage(media)
	}
})

// LEARN:
// let chat = await getChatById(chatId)

client.initialize()

function interceptor(message) {
	const found = ['hi', 'hello', 'namaste'].find((t) => message.toLowerCase() === t)
	return Boolean(found)
}
