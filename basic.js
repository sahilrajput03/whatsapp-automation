// @ts-nocheck
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');

// Create a new client instance
const client = new Client();

client.on('qr', (qr) => { qrcode.generate(qr, { small: true }); });

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Client is ready!');

    client.sendMessage('123', "pong-test");
});

// When the client received QR-Code
client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
});

// Start your client
client.initialize();
