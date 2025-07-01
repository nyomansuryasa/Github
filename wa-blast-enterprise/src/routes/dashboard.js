const express = require('express');
const fs = require('fs');
const path = require('path');
const Contact = require('../models/contact');
const { parse } = require('csv-parse/sync');

const router = express.Router();
const sessions = ['session-01', 'session-02']; // daftar sesi aktif

router.get('/', async (req, res) => {
    const stats = {};
    for (let sessionName of sessions) {
        const total = await Contact.count({ where: { sessionName } });
        const sent = await Contact.count({ where: { sessionName, status: 'sent' } });
        const failed = await Contact.count({ where: { sessionName, status: 'failed' } });
        const pending = await Contact.count({ where: { sessionName, status: 'pending' } });
        stats[sessionName] = { total, sent, failed, pending };
    }
    res.render('dashboard', { stats });
});

// Import CSV otomatis
router.post('/import', async (req, res) => {
    const filePath = path.join(__dirname, '../uploads/contact.csv');
    if (!fs.existsSync(filePath)) {
        return res.send('CSV file not found');
    }

    const fileContent = fs.readFileSync(filePath);
    const records = parse(fileContent, { columns: false, trim: true });

    for (let record of records) {
        const [number, message] = record;
        const randomSession = sessions[Math.floor(Math.random() * sessions.length)];

        await Contact.create({ number, message, sessionName: randomSession });
    }

    res.send('Import selesai');
});

module.exports = router;
