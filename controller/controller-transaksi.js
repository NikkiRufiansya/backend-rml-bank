// controllers/transaksiController.js
const Transaksi = require('../models/transaksi');
const Account = require('../models/account');

const getAllTransaksi = async (req, res) => {
    try {
        const transaksi = await Transaksi.findAll();
        res.json(transaksi);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createTransaksi = async (req, res) => {
    try {
        const { nomor_rekening, jns_transaksi, jumlah_transaksi, tgl_transaksi, tujuan_transaksi, account_id } = req.body;
        const newTransaksi = await Transaksi.create({ nomor_rekening, jns_transaksi, jumlah_transaksi, tgl_transaksi, tujuan_transaksi, account_id });
        res.status(201).json(newTransaksi);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTransaksiById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaksi = await Transaksi.findByPk(id);
        if (transaksi) {
            res.json(transaksi);
        } else {
            res.status(404).json({ error: 'Transaksi not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTransaksi = async (req, res) => {
    try {
        const { id } = req.params;
        const { nomor_rekening, jns_transaksi, jumlah_transaksi, tgl_transaksi, tujuan_transaksi, account_id } = req.body;
        const [updated] = await Transaksi.update({ nomor_rekening, jns_transaksi, jumlah_transaksi, tgl_transaksi, tujuan_transaksi, account_id }, {
            where: { trans_id: id }
        });
        if (updated) {
            const updatedTransaksi = await Transaksi.findByPk(id);
            res.json(updatedTransaksi);
        } else {
            res.status(404).json({ error: 'Transaksi not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteTransaksi = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Transaksi.destroy({
            where: { trans_id: id }
        });
        if (deleted) {
            res.status(204).end();
        } else {
            res.status(404).json({ error: 'Transaksi not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const createDepositTransaksi = async (req, res) => {
    try {
        const { nomor_rekening, jumlah_deposit, tgl_transaksi, account_id } = req.body;
        const jns_transaksi = 'DEPOSIT'; 
        const tujuan_transaksi = nomor_rekening; 

        const account = await Account.findOne({ where: { account_id } });
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        const jumlahDepositInt = parseInt(jumlah_deposit, 10);
        account.saldo += jumlahDepositInt;

        await account.save();

        const newTransaksi = await Transaksi.create({
            nomor_rekening,
            jns_transaksi,
            jumlah_transaksi: jumlahDepositInt,
            tgl_transaksi,
            tujuan_transaksi,
            account_id
        });

        res.status(201).json({
            transaksi: newTransaksi,
            updatedSaldo: account.saldo 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const createTransferTransaksi = async (req, res) => {
    try {
        const { nomor_rekening_pengirim, nomor_rekening_penerima, jumlah_transfer, tgl_transaksi, account_id_pengirim } = req.body;
        const jns_transaksi = 'TRANSFER'; 
        const tujuan_transaksi = nomor_rekening_penerima; 

        const accountPengirim = await Account.findOne({ where: { rekening: nomor_rekening_pengirim } });
        if (!accountPengirim) {
            return res.status(404).json({ error: 'Account pengirim not found' });
        }

        const accountPenerima = await Account.findOne({ where: { rekening: nomor_rekening_penerima } });
        if (!accountPenerima) {
            return res.status(404).json({ error: 'Account penerima not found' });
        }

        const jumlahTransferInt = parseInt(jumlah_transfer, 10); 
        if (accountPengirim.saldo < jumlahTransferInt) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        accountPengirim.saldo -= jumlahTransferInt;

        accountPenerima.saldo += jumlahTransferInt;

        await accountPengirim.save();
        await accountPenerima.save();

        const newTransaksiPengirim = await Transaksi.create({
            nomor_rekening: nomor_rekening_pengirim,
            jns_transaksi,
            jumlah_transaksi: jumlahTransferInt,
            tgl_transaksi,
            tujuan_transaksi,
            account_id: accountPengirim.account_id
        });

        const newTransaksiPenerima = await Transaksi.create({
            nomor_rekening: nomor_rekening_penerima,
            jns_transaksi: 'RECEIVED',
            jumlah_transaksi: jumlahTransferInt,
            tgl_transaksi,
            tujuan_transaksi: nomor_rekening_pengirim,
            account_id: accountPenerima.account_id
        });

        res.status(201).json({
            transaksiPengirim: newTransaksiPengirim,
            transaksiPenerima: newTransaksiPenerima,
            updatedSaldoPengirim: accountPengirim.saldo,
            updatedSaldoPenerima: accountPenerima.saldo
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTransaksiByAccountId = async (req, res) => {
    try {
        const { account_id } = req.params;
        
        const transaksi = await Transaksi.findAll({
            where: { account_id }
        });

        if (transaksi.length > 0) {
            res.json(transaksi);
        } else {
            res.status(404).json({ error: 'No transactions found for this account' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllTransaksi,
    createTransaksi,
    getTransaksiById,
    updateTransaksi,
    deleteTransaksi,
    createDepositTransaksi,
    createTransferTransaksi,
    getTransaksiByAccountId 
};


