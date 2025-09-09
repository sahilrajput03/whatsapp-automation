const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

// By Default it uses a persistent storage to store the session, yikes!
// const client = new Client({ authStrategy: new LocalAuth(), });

const client = new Client({
    authStrategy: new LocalAuth({
        // * Note: 'sahil' for my personal and 'topfivebestrated' for himanshu's bot.
        // clientId: 'sahil', // unique ID per number 
        clientId: 'topfivebestrated', // unique ID per number
        // Learn: Default `dataPath` folder path is `.wwebjs_auth`
        // dataPath: './sessions' // base folder for all accounts
    })
});

exports.client = client;