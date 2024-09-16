const express = require('express');
const verifyToken = require('../middleware/auth');
const { createTransaction, getTransactionsByAccountId } = require('../models/transactionModel');
const { getAccountByUserId, updateAccountBalance } = require('../models/accountModel');

const router = express.Router();

router.post('/payment', verifyToken, async (req, res) => {
    const { amount } = req.body;

    try {
        const account = await getAccountByUserId(req.user.id);
        if (account.balance < amount) return res.status(400).send('Insufficient balance');

        const newBalance = account.balance - amount;
        await updateAccountBalance(account.id, newBalance);
        const transaction = await createTransaction(account.id, amount, 'payment');

        res.json(transaction);
    } catch (err) {
        res.status(500).send('Error making payment');
    }
});

router.get('/history', verifyToken, async (req, res) => {
    try {
        const account = await getAccountByUserId(req.user.id);
        const transactions = await getTransactionsByAccountId(account.id);
        res.json(transactions);
    } catch (err) {
        res.status(500).send('Error fetching transaction history');
    }
});

module.exports = router;
