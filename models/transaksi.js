const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Pastikan path ini sesuai dengan struktur proyek Anda
const Account = require('./account'); // Import model Account

// Definisikan model 'transaksi'
const Transaksi = sequelize.define('transaksi', {
    trans_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    nomor_rekening: {
        type: DataTypes.STRING,
        allowNull: false
    },
    jns_transaksi: {
        type: DataTypes.STRING,
        allowNull: false
    },
    jumlah_transaksi: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    tgl_transaksi: {
        type: DataTypes.DATE,
        allowNull: false
    },
    tujuan_transaksi: {
        type: DataTypes.STRING,
        allowNull: false
    },
    account_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'account', // Nama tabel yang dirujuk di database
            key: 'account_id'
        },
        allowNull: false
    }
}, {
    freezeTableName: true,  // Nama tabel tidak akan diubah oleh Sequelize
    timestamps: false       // Tidak ada kolom timestamp (createdAt dan updatedAt)
});

// Relasi: Transaksi belongs to Account
Transaksi.belongsTo(Account, {
    foreignKey: 'account_id',
    as: 'account'
});

module.exports = Transaksi;
