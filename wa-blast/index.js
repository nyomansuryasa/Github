const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Pakai session lokal (agar tidak perlu scan QR setiap kali)
const client = new Client({
    authStrategy: new LocalAuth()
});

// QR code saat login
client.on('qr', (qr) => {
    console.log('Scan QR ini untuk login WhatsApp');
    qrcode.generate(qr, { small: true });
});

// Saat sudah login
client.on('ready', () => {
    console.log('Client siap terkoneksi ke WhatsApp');

    // Daftar nomor tujuan (ingat pakai kode negara, tanpa +)
    const targets = [
        '628123456789@c.us',
        '628987654321@c.us',
        '628567890123@c.us'
    ];

    // Pesan yang akan dikirim
    const message = 'Halo! Ini pesan blast dari bot WhatsApp 😎';

    // Kirim blast
    targets.forEach(async (number) => {
        try {
            await client.sendMessage(number, message);
            console.log(`Berhasil kirim ke ${number}`);
        } catch (err) {
            console.error(`Gagal kirim ke ${number}:`, err);
        }
    });
});

// Mulai koneksi client
client.initialize();
