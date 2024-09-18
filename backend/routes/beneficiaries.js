const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const authenticate = require('../middleware/auth');

// Add a new beneficiary
router.post('/add', authenticate, async (req, res) => {
  const { beneficiary_name, beneficiary_account } = req.body;
  const query = 'INSERT INTO beneficiaries (user_id, beneficiary_name, beneficiary_account) VALUES ($1, $2, $3)';
  const values = [req.user.id, beneficiary_name, beneficiary_account];
  
  try {
    const client = await pool.connect();
    await client.query(query, values);
    client.release();
    } catch (error) {
        console.error("An error occurred:", error.message);
        const data = {
            message: 'Failed to add beneficiary',
            isSuccessful: false,
            details:error.message
        }

        res.status(500).send(data);
        return;
    }
    const data = {
        message: 'Beneficiary added successfully',
        isSuccessful: true,
        details:error.message
    }

  res.status(201).send(data);
});

// Fetch all beneficiaries
router.get('/list', authenticate, async (req, res) => {
  const query = 'SELECT * FROM beneficiaries WHERE user_id = $1';
  const values = [req.user.id];
  let beneficiariesResult;
  
  try {
    const client = await pool.connect();
    beneficiariesResult = await client.query(query, values);
    client.release();
    } catch (error) {
        console.error("An error occurred:", error.message);
        const data = {
            isSuccessful: false,
            message: 'Failed to list beneficiary',            
            details: error.message
        }

        res.status(500).send(data);
        return;
    }
    const data = {
        isSuccessful: true,
        message: 'List beneficiary is successful',            
        details: JSON.stringify(beneficiariesResult.rows)
    }
  res.status(200).send(data);
});

module.exports = router;
