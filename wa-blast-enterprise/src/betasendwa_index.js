require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const { startWhatsApp } = require('./services/waClient');
const uploadRoute = require('./routes/upload');
const { generateQueue } = require('./services/queueService');
const { startBlast } = require('./services/blastWorker');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', uploadRoute);

sequelize.sync().then(async () => {
    console.log('Database & tables created!');

    const client = startWhatsApp('blast-01');

    client.on('ready', async () => {
        await generateQueue();
        startBlast(client);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
