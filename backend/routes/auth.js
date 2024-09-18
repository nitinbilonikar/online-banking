const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
const router = express.Router();
const cookieParser = require('cookie-parser');

router.use(cookieParser());

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (name, password) VALUES ($1, $2)';
  const values = [username, hashedPassword];
  
  const client = await pool.connect();
  await client.query(query, values);
  client.release();
  res.status(201).send('User registered');
});

// User login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE name = $1';
  const values = [username];
  
  const client = await pool.connect();
  const userResult = await client.query(query, values);
  const user = userResult.rows[0];
  client.release();
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Invalid credentials');
  }

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie('jwt', token, { httpOnly: true });
  res.json({ message: 'Login successful', token });
});

// User logout
router.post('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.send('Logged out');
});

module.exports = router;
