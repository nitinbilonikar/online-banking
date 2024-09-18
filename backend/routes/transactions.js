const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const authenticate = require('../middleware/auth');

// Fetch user transactions
router.get('/history', authenticate, async (req, res) => {
  const query = 'SELECT * FROM transactions WHERE account_id = $1';
  const values = [req.accountId];
  let transactionsResult;
  try {
        const client = await pool.connect();
        transactionsResult = await client.query(query, values);
        client.release();
    } catch (error) {
        console.error("An error occurred:", error.message);
        const data = {
            isSuccessful: false,
            message: 'Failed to fetch transactions',            
            details: error.message
        }
        res.status(500).send(data);
        return;
    }
    const data = {
        isSuccessful: true,
        message: 'Successfully fetched transaction history',            
        details: JSON.stringify(transactionsResult.rows)
    }
    res.status(200).send(data);
});

// Make a payment
router.post('/pay', authenticate, async (req, res) => {
  const { recipient_account, amount } = req.body;
  const userId = req.user.id;

  // Deduct amount from sender's account
  let query = 'UPDATE accounts SET balance = balance - $1 WHERE user_id = $2';
  let values = [amount, userId];
  try {
        const client = await pool.connect();
        await client.query(query, values);
        // Add amount to recipient's account
        query = 'UPDATE accounts SET balance = balance + $1 WHERE id = $2';
        values = [amount, recipient_account];
        await client.query(query, values);
        
        // Record the transaction
        query = 'INSERT INTO transactions (account_id, amount, type, timestamp) VALUES ($1, $2, $3, $4)';
        values = [userId, recipient_account, amount, 'payment'];
        await client.query(query, values);

        client.release();

    } catch (error) {
        console.error("An error occurred:", error.message);
        const data = {
            isSuccessful: false,
            message: 'Failed to make payment',            
            details: error.message
        }
        res.status(500).send(data);
        return;
    }
  const data = {
        isSuccessful: true,
        message: 'Payment is successful',            
        details: JSON.stringify(transactionsResult.rows)
    }
    res.status(201).send(data);
});

module.exports = router;
