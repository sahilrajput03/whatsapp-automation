// @ts-nocheck
const qrcode = require('qrcode-terminal');
const { client, clientId, tfbrClientId, sahilChatId } = require('./wwebclient');
const { MessageMedia } = require('whatsapp-web.js');
const { preventPunyCodeWarning, logMessageReceived } = require('./log-utils');
// https://wa.me/918360267243?text=hello%20world // Simple whatsapp link

preventPunyCodeWarning();

// ✅ This is to make sure I use tfbr's number in this file.
if (clientId !== tfbrClientId) { throw "❌Please use tfbr's clientId."; }

const initialMessageFromCustomer = `Hi I'm Surbhi.

topfivebestrated.com, [REF_ID:1234567890]`;
if (!hasRefId(initialMessageFromCustomer)) { throw new Error('Test message does not contain REF_ID'); }
const sampleButtonLink = "https://wa.me/918360267243?text=" + encodeURIComponent(initialMessageFromCustomer);
console.log("🚀 ~ sampleButtonLink:", sampleButtonLink);
// Button link for user[Tested✅]: <button onclick={() => window.open(sampleButtonLink)}>Submit (via Surbhi)</button>

function hasRefId(message) { return message.includes('REF_ID:'); }

const greet = `Hello Yce Network, This is Surbhi trying to connect with your business on topfivebestrated.com.

The enquiry message is as follows: hii

Visit www.topfivebestrated.com for more info about your business. Thank you!`;
const decathlonNumber = "9606489993";
const businessWaLinkWithGreet = `https://wa.me/91${decathlonNumber}?text=` + encodeURIComponent(greet);
const messgToCustomer = `Hi Surbhi, Thank you for reaching out to Topfivebestrated.com.

Here is the response to your enquiry for Top gggg. You can now chat directly with Yce Network using the whatsapp link below:
- Business Name: Yce Network
- Business Location Link: Zirakpur
- Business WhatsApp: ${businessWaLinkWithGreet}`;

client.on('qr', (qr) => { qrcode.generate(qr, { small: true }); });
client.on('ready', async () => {
	console.log('Client is ready!');
	await client.sendMessage(sahilChatId, messgToCustomer);
});

// ❤️ Emitted when a new message is received.
client.on('message', async (message) => {
	logMessageReceived(message);
	if (hasRefId(message.body)) {
		await client.sendMessage(message.from, messgToCustomer);
	}
});

client.initialize();




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