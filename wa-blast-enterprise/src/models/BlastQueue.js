const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BlastQueue = sequelize.define('BlastQueue', {
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending'
    },
    attempt: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    lastError: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = BlastQueue;
