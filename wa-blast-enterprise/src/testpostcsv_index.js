require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const { startWhatsApp } = require('./services/waClient');
const uploadRoute = require('./routes/upload');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', uploadRoute);

// start DB & WA Client
sequelize.sync().then(() => {
    console.log('Database & tables created!');
});

startWhatsApp('blast-01');

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
