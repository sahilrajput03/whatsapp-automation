const express = require('express');
const { preventPunyCodeWarning } = require('./log-utils');
const { default: axios } = require('axios');
const qrcode = require('qrcode-terminal');
const { MessageMedia } = require('whatsapp-web.js');
// https://wa.me/918360267243?text=hello%20world // Simple whatsapp link
const { yceSnippets } = require('./yce-snippets');
const { client } = require('./wwebclient');
const { getPhoneNumberFromChatId } = require('./utils');
const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) { throw new Error('❌GOOGLE_API_KEY environment variable is not set.'); }
const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

const PREFIX = "yes.";
const yceSnippetsTerms = Object.keys(yceSnippets).map(s => PREFIX + s);
yceSnippetsTerms.push(PREFIX);

// Add help snippets as well e.g, "yes." will show all avilable snippets.
yceSnippets[PREFIX] = 'The available snippets are: \n* ' + yceSnippetsTerms.join('\n* ');
console.log("🚀 ~ yceSnippets[PREFIX]:", yceSnippets[PREFIX]);

preventPunyCodeWarning();

const consumeConsumerInteraction = require('./himanshu/sampleResponseOfConsumeConsumerInteraction');

const initialMessageFromCustomer = `Hi I'm Surbhi.

topfivebestrated.com, [REF_ID:1234567890]`;
if (!hasRefId(initialMessageFromCustomer)) { throw new Error('Test message does not contain REF_ID'); }
const sampleButtonLink = "https://wa.me/918360267243?text=" + encodeURIComponent(initialMessageFromCustomer);
// console.log("🚀 ~ sampleButtonLink:", sampleButtonLink);
// Button link for user[Tested✅]: <button onclick={() => window.open(sampleButtonLink)}>Submit (via Surbhi)</button>

function hasRefId(message) { return message.includes('REF_ID:'); }
function getRefId(message) { // https://chatgpt.com/c/68bac2a0-7904-8327-9be4-dacc0fb09963
	const match = message.match(/\[REF_ID:\s*(\d+)\]/);
	return match ? match[1] : null;
}

// const businessWhatsapp = "9606489993"; // ? working phone number

const greet = (customerName, customerMessage, businessName) => `Hello ${businessName}, This is ${customerName} trying to connect with your business on topfivebestrated.com.

The enquiry message is as follows --- ${customerMessage}

Visit www.topfivebestrated.com for more info about your business. Thank you!`;
const businessWaLinkWithGreet = (customerName, customerMessage, businessName, businessWhatsAppNumber) => `https://wa.me/91${businessWhatsAppNumber}?text=` + encodeURIComponent(greet(customerName, customerMessage, businessName));
const messgToCustomer = (customerName, customerMessage, businessName, businessLocationLink, businessWhatsAppNumber, slug) => {
	// Note: Now I'm usinig pre generated whatsapp link (saved on `customer_interaction.whatsapp_link`) from a short alias link like `waSlugLink` in favor of showing short link to users.
	// const businessWaLink = businessWaLinkWithGreet(customerName, customerMessage, businessName, businessWhatsAppNumber);
	// const waSlugLink = `https://topfivebestrated.com/portal/api/customer-interactions/${slug}/whatsapp`;
	// 	Using .htaccess I redirected below url to laravel's route, i.e,
	// 		Example: https://topfivebestrated.com/wa/c3077925f42e38ed/whatsapp redirects to https://topfivebestrated.com/portal/api/customer-interactions/c3077925f42e38ed/whatsapp
	const waSlugLink = `https://topfivebestrated.com/wa/${slug}/whatsapp`;

	return `Hi ${customerName}, Thank you for reaching out to Topfivebestrated.com.

Here is the response to your enquiry for ${customerMessage}. You can now chat directly with ${businessName} using the whatsapp link below:
- Business Name: ${businessName}
- Business WhatsApp: ${waSlugLink}
- Phone: ${businessWhatsAppNumber}
- Business Location Link: ${businessLocationLink}
`;
};


client.on('qr', (qr) => { qrcode.generate(qr, { small: true }); });

// const MOCK_RECEIVED_MESSAGE_BODY = `
// Hi I'm s4.
// hi i'm s4
// topfivebestrated.com, [REF_ID: 29]`;
// console.log('REF_ID?', getRefId(MOCK_RECEIVED_MESSAGE_BODY));

client.on('ready', async () => { console.log('Client is ready!'); });


// Note: I'm keeing this outisde of `handleMessageBySalesman` as its helpful
// 	to have context previous history without having to save to database
// 	for testing purpose for now.
const aiChatSalesman = ai.chats.create({
	model: "gemini-2.5-flash",
	config: {
		// System Prompt: https://chatgpt.com/c/68c193d1-a0c8-8328-806d-074d71a4c931
		systemInstruction: "You are a friendly sales agent for YES PRINT. Talk in short Hinglish. Answer customer queries, suggest printing services (pamphlets, posters, banners, lamination, etc.), give prices if asked, and encourage quick orders. Keep replies simple, clear, and professional.",
	}
});
async function handleMessageBySalesman(message) {
	const chat = await message.getChat();
	try {
		const response1 = await aiChatSalesman.sendMessage({ message: message.body });
		await chat.sendMessage(`${AI_BOT_FLAG}: ${response1.text}`);
		// console.log("✅ Chat response 1:", response1.text);
	} catch (error) {
		console.log('ERROR ❌❌ ❌ ❌ ❌ ❌ ❌  ', error.toString());
	}
}

client.on('message', async (message) => {
	console.log(`✅ RECEIVED from ${message.from}`, message.body);
	// await client.sendMessage(message.from, messgToCustomer(customerName, businessName, businessLocationLink, businessWhatsAppNumber));

	if (hasRefId(message.body)) { handleRefIdMessage(message.from, message.body); }
	else { console.log('\t❌ refId not found in the message.'); }

	// ! Add `from` when testing the sales bot.
	// const isFromSpecificNumber = message.from === '****8'; 
	// const isToSahil = message.to === sahilChatId;
	// if (isToSahil && isFromSpecificNumber) {
	// 	await handleMessageBySalesman(message);
	// }
});

const sahilChatId = '918360267243@c.us';
const AI_BOT_FLAG = "Piku 🌸";

client.on('message_create', async (message) => {  // src:https://chatgpt.com/c/68bdc513-35b0-832b-83dd-32b11a324bbe 
	if (message.fromMe) { // Only handle messages sent by you (not incoming)
		console.log(`🚀 YOU SENT A MESSAGE to ${message.to}:`, message.body);
		const chat = await message.getChat();

		const isToSahil = message.to === sahilChatId;
		const hasNoBotFlag = !message.body.includes(AI_BOT_FLAG);
		const isFromSahil = message.from === sahilChatId; // ? This is necessary so that below code only triggers for my own number.
		if (isToSahil && hasNoBotFlag && isFromSahil) {
			// Note: Adding bot flag will ensure that our bot does NOT reply its own
			// 		 message. Otherwise it can cause infinite loop replying to its own messages.
			// await chat.sendMessage(`${AI_BOT_FLAG}: + 'Hello from bot.\n'`);

			// Using AI to reply:
			// Note: We must create the instance each time otherwise it stores
			// 		all previous messages which is not what I want for now.
			const aiChat = ai.chats.create({ model: "gemini-2.5-flash" });
			const response1 = await aiChat.sendMessage({ message: message.body });
			// console.log("✅ Chat response 1:", response1.text);
			await chat.sendMessage(`${AI_BOT_FLAG}: ${response1.text}`);
		}

		if (yceSnippetsTerms.some(s => s === message.body)) {
			// if (message.body === 'magic.1') { // Simple Test
			// await chat.sendMessage("this is magic 1 text");
			let key = message.body === PREFIX ? message.body : message.body.replace(PREFIX, "");
			await chat.sendMessage(yceSnippets[key]);
		}
	}
});

client.initialize();

const handleRefIdMessage = async (senderChatId, messageBody) => {
	// if (hasRefId(MOCK_RECEIVED_MESSAGE_BODY)) { console.log('❌ refId not found in -- MOCK_RECEIVED_MESSAGE_BODY -- message.') } // ! TESTING  ONLY
	// const res = consumeConsumerInteraction.res; // ! TESTING  ONLY
	const id = getRefId(messageBody);
	console.log('\t✅ REF_ID?', id);
	try {
		const res = await axios.post(`https://topfivebestrated.com/portal/api/customer-interactions/${id}/consume`);
		if (res.data.status === 'success') {
			const { customer_interaction, business } = res.data;

			const customerName = customer_interaction.customer_name;
			const customerMessage = customer_interaction.message;
			const slug = customer_interaction.slug;
			const businessName = business.name;
			const businessWhatsAppNumber = business?.whatsapp?.replace(/\s+/g, "");;
			console.log("🚀 ~ businessWhatsAppNumber:", businessWhatsAppNumber);
			const businessLocationLink = business.location_url;
			// await client.sendMessage("918360267243" + "@c.us", 'test 123 static!');  // ! For testing only
			// Preferring `senderChatId`=`messag.from` for reliable customer's whatsapp number
			await client.sendMessage(senderChatId, messgToCustomer(customerName, customerMessage, businessName, businessLocationLink, businessWhatsAppNumber, slug));

			// Sending message to business owner:
			const messageToBusinessNumber = `
Hello ${businessName}, This is ${customerName} trying to connect with your business on topfivebestrated.com.
- The enquiry message is as follows: ${customerMessage}
- Phone: ${getPhoneNumberFromChatId(senderChatId)}

Visit www.topfivebestrated.com for more info about your business. Thank you!
`;
			console.log("🚀 businessWhatsAppNumber:", businessWhatsAppNumber);
			const businessChatId = "91" + businessWhatsAppNumber + "@c.us";
			console.log("🚀 businessChatId:", businessChatId);
			await client.sendMessage(businessChatId, messageToBusinessNumber);
		} else {
			console.log('❌ Got error in consume_customer_interaction API.');
			console.log('res.data?', res.data);
		}
	} catch (error) {
		console.log('❌ Failed to create customer interaction.');
		console.log(' error.response.data?', error.response.data);
	}
};


// 🚀 🚀 🚀 Ulta Fast Testing 🚀 🚀 
const app = express();
const PORT = 9000;
app.listen(PORT, () => { console.log('🚀Server started on:', `http://localhost:${PORT}`); });
app.use(express.json()); // To accept json data (source: https://expressjs.com/en/api.html#express.json)
app.get('/', (req, res) => { res.send('ok'); });
app.post('/', (req, res) => {
	console.log('⭐️ Received HTTP request:  req.body?', req.body);
	handleRefIdMessage(sahilChatId, req.body.message);
	res.send('ok');
})


/*
CUSOTMER_INITIATED_QUERY:
************
Hi I'm Surbhi.
Source: topfivebestrated.com, [REF_ID:1234567890]

TO CUSTOMER:
************
Hi Surbhi, Thank you for reaching out to Topfivebestrated.com. Here is the response to your enquiry for Top gggg. You can now chat directly with Yce Network by on 
- Business Name: Yce Network
- Business WhatsApp: https://wa.me/918360267243?text=hello%20world 
- Business Location Link :Zirakpur


-x-x-x-x-x-x--xx---x-x- (BELOW IS NOT NEEDED FOR MY CASE) -x-x-x-x-
TO BUSINESS:
************
Hello Yce Network, This is Surbhi trying to connect with your business on topfivebestrated.com.
- The enquiry message is as follows: hii
Visit www.topfivebestrated.com for more info about your business. Thank you!
*/