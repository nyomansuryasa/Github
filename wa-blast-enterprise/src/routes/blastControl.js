const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const Contact = require('../models/contact');

let blastingActive = false;

router.post('/start', async (req, res) => {
    try {
        const csvPath = path.join(__dirname, '../uploads/contact.csv');
        if (!fs.existsSync(csvPath)) {
            return res.status(400).send('❌ File CSV tidak ditemukan di folder uploads.');
        }

        const fileContent = fs.readFileSync(csvPath);
        const records = parse(fileContent, { delimiter: ',', from_line: 1 });

        for (const [number, message] of records) {
            await Contact.create({ number, message, status: 'pending' });
        }

        blastingActive = true;
        res.send('🚀 Blasting started');
    } catch (err) {
        console.error('❌ Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/stop', (req, res) => {
    blastingActive = false;
    res.send('⏹ Blasting stopped');
});

router.get('/status', (req, res) => {
    res.json({ blastingActive });
});

module.exports = { router, blastingActiveRef: () => blastingActive };
