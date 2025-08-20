
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
// https://wa.me/918360267243?text=hello%20world // Simple whatsapp link

const testInitialMessgFromCustomer = `Hi I'm Surbhi.
Source: topfivebestrated.com, [CONVERSATION_ID:1234567890]`;
// console.log('has converstion id?', hasConversationId(initialMessgFromCustomer));

function hasConversationId(message) { return message.includes('CONVERSATION_ID:'); }

const greet = `Hello Yce Network, This is Surbhi trying to connect with your business on topfivebestrated.com.

The enquiry message is as follows: hii

Visit www.topfivebestrated.com for more info about your business. Thank you!`;
const businessWaLinkWithGreet = "https://wa.me/918360267243?text=" + encodeURIComponent(greet);
const messgToCustomer = `Hi Surbhi, Thank you for reaching out to Topfivebestrated.com.

Here is the response to your enquiry for Top gggg. You can now chat directly with Yce Network using the whatsapp link below:
- Business Name: Yce Network
- Business Location Link: Zirakpur
- Business WhatsApp: ${businessWaLinkWithGreet}`;

const client = new Client({ authStrategy: new LocalAuth(), });
client.on('qr', (qr) => { qrcode.generate(qr, { small: true }); });
client.on('ready', async () => {
	console.log('Client is ready!');
	// const sahilNumber = "918360267243";
	// const chatId = sahilNumber + "@c.us";
	// await client.sendMessage(chatId, "Hello back!");
	// await client.sendMessage(chatId, messgToCustomer);
});

client.on('message', async (message) => {
	console.log('::RECEIVED::', message.body);
	console.log('	::FROM::', message.from);
	if (hasConversationId(message.body)) {
		await client.sendMessage(message.from, messgToCustomer);
	}
});

client.initialize();




/*
CUSOTMER_INITIATED_QUERY:
************
Hi I'm Surbhi.
Source: topfivebestrated.com, [CONVERSATION_ID:1234567890]

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