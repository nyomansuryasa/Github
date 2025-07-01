const express = require('express');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { sequelize, Contact } = require('./models/contact');
const { importCSV } = require('./helpers/csvLoader');
const { startBlast } = require('./blaster');
const dashboard = require('./routes/dashboard');
const app = express();

app.use('/dashboard', dashboard);
app.use(express.static('public'));

(async () => {
  await sequelize.sync();
  console.log("Database ready.");

  await importCSV('contact.csv');

  const sessions = ['session-01', 'session-02'];

  for (const sessionName of sessions) {
    const client = new Client({
      authStrategy: new LocalAuth({ clientId: sessionName }),
      puppeteer: { headless: true }
    });

    client.on('qr', qr => {
      console.log(`Scan QR untuk ${sessionName}:`);
      qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
      console.log(`✅ ${sessionName} siap`);
      startBlast(client, sessionName);
    });

    client.initialize();
  }

app.get("/", (req, res) => {
  res.send("WA Blast API Running");
});


  app.listen(3000, () => console.log("Server berjalan di http://localhost:3000"));
})();
