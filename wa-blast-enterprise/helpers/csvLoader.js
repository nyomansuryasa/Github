const fs = require('fs');
const csv = require('csv-parser');
const { Contact } = require('../models/contact');

const sessions = ['session-01', 'session-02']; // Bisa ditambah
let sessionCounter = 0;

function sanitizeNumber(number) {
  let num = number.replace(/\D/g, '');
  if (!num.startsWith('62')) num = '62' + num.slice(- (num.length - 1));
  return num;
}

async function importCSV(filename) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filename)
      .pipe(csv())
      .on('data', (data) => {
        const number = sanitizeNumber(data.number);
        const message = data.message;
        const sessionName = sessions[sessionCounter % sessions.length];
        sessionCounter++;

        results.push({ number, message, sessionName });
      })
      .on('end', async () => {
        for (const row of results) {
          await Contact.create({ ...row, status: 'pending' });
        }
        resolve();
      })
      .on('error', reject);
  });
}

module.exports = { importCSV };
