const express = require('express');
const accountController = require('../controller/controller-account');
const transaksiController = require('../controller/controller-transaksi');
const eventController = require('../controller/controller-event');
const verifyToken = require("../config/middleware/verifyJwt");

const router = express.Router();

// Route untuk login akun
router.post('/login', accountController.loginAcc);

// Rute untuk Account
router.get('/accounts', verifyToken, accountController.getAllAccounts);
router.post('/accounts', accountController.createAccount);
router.get('/accounts/:id', verifyToken, accountController.getAccountById);
router.put('/accounts/:id', verifyToken, accountController.updateAccount);
router.delete('/accounts/:id', verifyToken, accountController.deleteAccount);

// Rute untuk Transaksi
router.get('/transaksi', verifyToken, transaksiController.getAllTransaksi);
router.post('/transaksi', verifyToken, transaksiController.createTransaksi);
router.get('/transaksi/:id', verifyToken, transaksiController.getTransaksiById);
router.put('/transaksi/:id', verifyToken, transaksiController.updateTransaksi);
router.delete('/transaksi/:id', verifyToken, transaksiController.deleteTransaksi);

//Rute untuk Event
router.get('/event', verifyToken, eventController.getAllEvent);
router.post('/event', eventController.createEvent);
router.get('/event/:id', verifyToken, eventController.getEventById);
router.delete('/event/:id', verifyToken, eventController.deleteEvent);

router.post("/deposite", verifyToken, transaksiController.createDepositTransaksi)
router.post("/transfer", verifyToken, transaksiController.createTransferTransaksi)
router.get("/history/:account_id", verifyToken, transaksiController.getTransaksiByAccountId)
// Example route
router.get('/', (req, res) => {
    res.send('Welcome to the Banking API');
});

module.exports = router;
