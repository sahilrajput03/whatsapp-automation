// @ts-nocheck
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

// * Learn: We can create multiple wa bots using `const client2 = new Client(...)` (src: https://wwebjs.dev/guide/creating-your-bot/authentication.html#location-path )
// * Learn: Storing your auth session to dabase like mongodb ❤️: https://wwebjs.dev/guide/creating-your-bot/authentication.html#remote-stores

// By Default it uses a persistent storage to store the session, yikes!
// const client = new Client({ authStrategy: new LocalAuth(), });

const sahilClientId = 'sahil'; // unique ID per number 
const tfbrClientId = 'topfivebestrated'; // unique ID per number 
// ! Add a check before commiting via `git commit hook` so that I never commit without clientid as `topfivebestrated`

// const clientId = sahilClientId;
const clientId = tfbrClientId;

const client = new Client({
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

const handleHealthCheckPingMessage = (message) => {
    // ✅ Bot Health Check Command: Reply back "pong" directly to the message
    if (message.body === '!ping') {
        message.reply('pong');
        console.log('\t✅ Replying `pong` to command `!ping`');
    }
};

module.exports = {
    client, clientId, sahilClientId, tfbrClientId,
    sahilChatId, ratanChatId, himanshuChatId,
    handleHealthCheckPingMessage,
};