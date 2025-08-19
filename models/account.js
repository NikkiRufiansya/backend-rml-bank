const sequelize = require('sequelize');
const db = require('../config/db'); // Ensure this path matches your project's structure

// Define the 'account' model
const Account = db.define('account', {
    account_id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    username: {
        type: sequelize.STRING(255), // Changed from TEXT to VARCHAR(255)
        allowNull: false,
    },
    email: {
        type: sequelize.STRING(255), // Changed from TEXT to VARCHAR(255)
        allowNull: false,
    },
    password: {
        type: sequelize.TEXT,
        allowNull: false
    },
    rekening: {
        type: sequelize.STRING(50), // Changed from TEXT to VARCHAR(50)
        allowNull: false,
    },
    saldo: {
        type: sequelize.FLOAT,
        allowNull: false
    }
}, {
    freezeTableName: true,  // Table name will not be pluralized by Sequelize
    timestamps: false       // No timestamp columns (createdAt, updatedAt)
});

module.exports = Account;
