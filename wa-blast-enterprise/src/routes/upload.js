const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { parse } = require('csv-parse');
const Contact = require('../models/contact');

router.post('/webupload', async (req, res) => {
    try {
	console.log('FILES:', req.files);
        if (!req.files || !req.files.csvfile) {
            return res.status(400).send('No file uploaded.');
        }

        const uploadedFile = req.files.csvfile;
        const uploadDir = path.join(__dirname, '../uploads/');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        const uploadPath = path.join(uploadDir, uploadedFile.name);
        await uploadedFile.mv(uploadPath);

        const parser = fs.createReadStream(uploadPath).pipe(parse({ delimiter: ',', from_line: 1 }));

        for await (const record of parser) {
            const [number, message] = record;

            await Contact.create({
                number,
                message,
                status: 'pending',
            });
        }

        res.redirect('/');
    } catch (err) {
        console.error('❌ Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
