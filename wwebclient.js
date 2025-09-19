const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

// * Learn: We can create multiple wa bots using `const client2 = new Client(...)` (src: https://wwebjs.dev/guide/creating-your-bot/authentication.html#location-path )
// * Learn: Storing your auth session to dabase like mongodb ❤️: https://wwebjs.dev/guide/creating-your-bot/authentication.html#remote-stores

// By Default it uses a persistent storage to store the session, yikes!
// const client = new Client({ authStrategy: new LocalAuth(), });

// const clientid = 'sahil'; // unique ID per number 
export const clientid = 'topfivebestrated'; // unique ID per number 
// ! Add a check before commiting via `git commit hook` so that I never commit without clientid as `topfivebestrated`

const client = new Client({
    authStrategy: new LocalAuth({
        // * Note: 'sahil' for my personal and 'topfivebestrated' for himanshu's bot.
        clientId: clientid,
        // Learn: Default `dataPath` folder path is `.wwebjs_auth`
        // dataPath: './sessions' // base folder for all accounts
    })
});

exports.client = client;