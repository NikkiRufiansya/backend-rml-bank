const sequelize = require('sequelize');
const db = require('../config/db');

const Event = db.define('event', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    email: {
        type: sequelize.STRING(40),
        allowNull: false,
    },
    status: {
        type: sequelize.ENUM('Pass', 'Fail'),
        allowNull: false,
    },
    token_status: {
        type: sequelize.ENUM('VALID', 'INVALID'),
        allowNull: false,
    },
    token: {
        type: sequelize.STRING(255),
        allowNull: false,
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = Event