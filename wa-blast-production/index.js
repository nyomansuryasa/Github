const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const multer = require('multer');
const csv = require('csv-parse');
const fs = require('fs');
const qrcode = require('qrcode-terminal');
const path = require('path');

const app = express();
const PORT = 3000;

// Setup multer for file upload
const upload = multer({ dest: 'uploads/' });

// Serve static files for Web UI
app.use(express.static('public'));

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
    const filePath = path.join(__dirname, req.file.path);
    parseCSV(filePath);
    res.send('File diterima. Pengiriman dimulai...');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});

// Setup WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp Client Siap!');
});

client.initialize();

// CSV Parser & Blast Function
async function parseCSV(filePath) {
    const contacts = [];
    fs.createReadStream(filePath)
        .pipe(csv.parse({ delimiter: ',', from_line: 1 }))
        .on('data', row => {
            if (row.length >= 2) {
                contacts.push({ number: row[0], message: row[1] });
            }
        })
        .on('end', async () => {
            console.log(`Berhasil parsing ${contacts.length} kontak. Mulai pengiriman WA...`);
            for (const contact of contacts) {
                try {
                    const number = contact.number + '@c.us';
                    await client.sendMessage(number, contact.message);
                    console.log(`Berhasil kirim ke ${contact.number} (${contact.message})`);

                    // Random delay between 3-7 seconds
                    const delay = Math.floor(Math.random() * 4000) + 3000;
                    console.log(`Delay ${delay / 1000} detik...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } catch (err) {
                    console.error(`Gagal kirim ke ${contact.number}: ${err}`);
                }
            }
            fs.unlinkSync(filePath); // Hapus file setelah selesai
        });
}
