// controllers/accountController.js
const Account = require('../models/account');
const bcrypt = require('bcrypt'); // Import bcrypt untuk verifikasi password
const jwt = require('jsonwebtoken'); // Import JWT untuk menghasilkan token
require("dotenv").config();


const getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.findAll();
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createAccount = async (req, res) => {
    try {
        const { username, email, password, rekening } = req.body;

        // Validasi input
        if (!username || !email || !password || !rekening ) {
            return res.status(400).json({ message: 'Semua field harus diisi' });
        }

        // Hash password
        const saltRounds = 10; // Jumlah round salt
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new account with hashed password
        const newAccount = await Account.create({
            username,
            email,
            password: hashedPassword, // Simpan password yang sudah di-hash
            rekening,
            saldo:0
        });

        res.status(201).json(newAccount);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAccountById = async (req, res) => {
    try {
        const { id } = req.params;
        const account = await Account.findByPk(id);
        if (account) {
            res.json(account);
        } else {
            res.status(404).json({ error: 'Account not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password, rekening, saldo } = req.body;
        const [updated] = await Account.update({ username, email, password, rekening, saldo }, {
            where: { account_id: id }
        });
        if (updated) {
            const updatedAccount = await Account.findByPk(id);
            res.json(updatedAccount);
        } else {
            res.status(404).json({ error: 'Account not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Account.destroy({
            where: { account_id: id }
        });
        if (deleted) {
            res.status(204).end();
        } else {
            res.status(404).json({ error: 'Account not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// For Login
const loginAcc= async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email);
        console.log(password);
        // Validasi input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email dan password harus diisi' });
        }

        // Temukan akun berdasarkan email
        const account = await Account.findOne({ where: { email } });
        if (!account) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        // Verifikasi password
        const isPasswordValid = await bcrypt.compare(password, account.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Username atau password salah' });
        }

        // Generate JWT token
       const token = jwt.sign({ accountId: account.account_id }, process.env.JWT_SECRET, { expiresIn: '24h' });

                // Respons sukses
        res.status(200).json({
            message: 'Login berhasil',
            account: {
                account_id: account.account_id,
                username: account.username,
                email: account.email,
                rekening: account.rekening,
                saldo: account.saldo
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllAccounts,
    createAccount,
    getAccountById,
    updateAccount,
    deleteAccount,
    loginAcc
};
