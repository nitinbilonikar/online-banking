const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const authenticate = require('../middleware/auth');

// Fetch user account details
router.get('/details', authenticate, async (req, res) => {
  const query = 'SELECT * FROM accounts WHERE user_id = $1';
  const values = [req.user.id];
  
  const client = await pool.connect();
  const accountResult = await client.query(query, values);
  client.release();

  res.json(accountResult.rows[0]);
});

module.exports = router;
