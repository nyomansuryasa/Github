const express = require('express');
const multer = require('multer');
const { parse } = require('csv-parse');
const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = 3000;

// Inisialisasi WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: false, // untuk debugging
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});



client.on('qr', (qr) => {
    console.log('Scan QR ini untuk login WhatsApp');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp Client Siap!');
});

client.initialize();

// Middleware form
app.use(express.urlencoded({ extended: true }));

// Tampilkan form upload
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

// Handle upload
app.post('/upload', upload.single('csvfile'), (req, res) => {
    const filePath = req.file.path;
    const messageTemplate = req.body.message;

    const contacts = [];

    fs.createReadStream(filePath)
    .pipe(parse({ delimiter: ',', from_line: 1, trim: true, skip_empty_lines: true }))
    .on('data', (row) => {
        // pastikan hanya ambil baris valid
        if (row.length >= 2 && row[0] && row[1]) {
            const [number, name] = row;
            contacts.push({ number: number.trim(), name: name.trim() });
        }
    })
    .on('end', async () => {
        console.log(`Berhasil parsing ${contacts.length} kontak. Mulai pengiriman WA...`);

            for (let i = 0; i < contacts.length; i++) {
                const contact = contacts[i];
                const personalizedMsg = messageTemplate.replace('{nama}', contact.name);
                const waNumber = convertToWhatsAppId(contact.number);
                
                try {
                    await client.sendMessage(waNumber, personalizedMsg);
                    console.log(`Berhasil kirim ke ${contact.number} (${contact.name})`);
                } catch (err) {
                    console.error(`Gagal kirim ke ${contact.number}:`, err);
                }

                const delay = getRandomInt(3000, 7000);
                console.log(`Delay ${delay / 1000} detik...`);
                await sleep(delay);
            }

            fs.unlinkSync(filePath); // hapus file upload setelah selesai
            res.send('Blast selesai!');
        });
});

// Utility

function convertToWhatsAppId(number) {
    // Pastikan format internasional tanpa +
    return number.replace(/\D/g, '') + '@c.us';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
