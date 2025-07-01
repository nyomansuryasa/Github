const fs = require('fs');
const path = require('path');
const { Client, LocalAuth } = require('whatsapp-web.js');

function startWhatsApp(sessionName, io) {
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: sessionName }),
    puppeteer: { headless: true }
  });

  client.on('qr', qr => {
    console.log(`QR for ${sessionName}:`, qr);
    io.emit('qr', { session: sessionName, qr });
  });

  client.on('ready', () => {
    console.log(`✅ ${sessionName} ready`);
    io.emit('ready', { session: sessionName });
  });

  client.initialize();

  return client;
}

module.exports = { startWhatsApp };
