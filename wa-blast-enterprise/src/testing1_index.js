require('dotenv').config();
const sequelize = require('./config/database');
const { startWhatsApp } = require('./services/waClient');

// Start database
sequelize.sync().then(() => {
    console.log('Database & tables created!');
});

// Start WA client session
startWhatsApp('blast-01');
