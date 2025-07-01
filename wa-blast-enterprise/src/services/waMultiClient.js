const fs = require('fs');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { startBlast } = require('./blastWorker');

const sessions = ['session-01', 'session-02'];

function initializeWhatsApp() {
    sessions.forEach(sessionName => {
        const client = new Client({
            authStrategy: new LocalAuth({ clientId: sessionName }),
            puppeteer: { headless: true, args: ['--no-sandbox'] }
        });

        client.on('qr', qr => {
            console.log(`Scan QR untuk ${sessionName}:`);
            qrcode.generate(qr, { small: true });
        });

        client.on('ready', () => {
            console.log(`✅ ${sessionName} siap`);
            startBlast(client, sessionName);
        });

        client.on('auth_failure', msg => {
            console.error(`❌ Auth failure di ${sessionName}:`, msg);
        });

        client.initialize();
    });
}

module.exports = { initializeWhatsApp };
