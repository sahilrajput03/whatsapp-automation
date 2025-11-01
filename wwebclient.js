// @ts-nocheck
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
require('dotenv').config({ quiet: true });

// * Learn: We can create multiple wa bots using `const client2 = new Client(...)` (src: https://wwebjs.dev/guide/creating-your-bot/authentication.html#location-path )
// * Learn: Storing your auth session to dabase like mongodb ❤️: https://wwebjs.dev/guide/creating-your-bot/authentication.html#remote-stores

// By Default it uses a persistent storage to store the session, yikes!
// const client = new Client({ authStrategy: new LocalAuth(), });

const sahilClientId = 'sahil'; // unique ID per number 
const tfbrClientId = 'topfivebestrated'; // unique ID per number 
// ! Add a check before commiting via `git commit hook` so that I never commit without clientid as `topfivebestrated`

const clientId = process.env.CLIENT_ID;

const client = new Client({
    // Src: https://wwebjs.dev/guide/creating-your-bot/authentication.html
    puppeteer: { args: ['--no-sandbox', /*'--disable-setuid-sandbox' NOT_NEEDED_NOW-----SAHIL*/], },
    authStrategy: new LocalAuth({
        // * Note: 'sahil' for my personal and 'topfivebestrated' for himanshu's bot.
        clientId: clientId,
        // Learn: Default `dataPath` folder path is `.wwebjs_auth`
        // dataPath: './sessions' // base folder for all accounts
    })
});

const phoneToChatId = (phone) => phone + "@c.us";

const sahilNumber = "918360267243"; const sahilChatId = phoneToChatId(sahilNumber);
const ratanNumber = "918699621565"; const ratanChatId = phoneToChatId(ratanNumber);
const himanshuNumber = "918847037612"; const himanshuChatId = phoneToChatId(himanshuNumber);
const groupYceWhatsappAPIChatId = "120363421828061554@g.us";

const handleHealthCheckPingMessage = (message) => {
    // ✅ Bot Health Check Command: Reply back "pong" directly to the message
    if (message.body === '!ping') {
        message.reply('pong');
        console.log('\t✅ Replying `pong` to command `!ping`');
    }
};

function createHtmlPage(body) {
    const headTag = `<head> <meta name="viewport" content="width=device-width, initial-scale=1.0"> </head>`;
    return `<html> ${headTag} <body> ${body} </body> </html>`;
}

module.exports = {
    client, clientId, sahilClientId, tfbrClientId,
    sahilChatId, ratanChatId, himanshuChatId, groupYceWhatsappAPIChatId,
    handleHealthCheckPingMessage, createHtmlPage
};