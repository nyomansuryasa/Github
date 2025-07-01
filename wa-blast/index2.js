const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Pakai session lokal
const client = new Client({
    authStrategy: new LocalAuth()
});

// QR code saat login
client.on('qr', (qr) => {
    console.log('Scan QR ini untuk login WhatsApp');
    qrcode.generate(qr, { small: true });
});

// Saat sudah login
client.on('ready', async () => {
    console.log('Client siap terkoneksi ke WhatsApp');

    const targets = [
        '628123456789@c.us',
        '628987654321@c.us',
        '628567890123@c.us'
    ];

    const message = 'Halo! Ini pesan blast dari bot WhatsApp 😎';

    // Mulai kirim dengan delay random
    for (let i = 0; i < targets.length; i++) {
        const number = targets[i];
        try {
            await client.sendMessage(number, message);
            console.log(`Berhasil kirim ke ${number}`);
        } catch (err) {
            console.error(`Gagal kirim ke ${number}:`, err);
        }

        // Delay random antara 3 - 7 detik
        const delay = getRandomInt(3000, 7000);
        console.log(`Menunggu ${delay / 1000} detik sebelum kirim ke nomor berikutnya...`);
        await sleep(delay);
    }

    console.log('Selesai mengirim semua pesan');
});

// Fungsi delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fungsi random integer (min-max)
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

client.initialize();
