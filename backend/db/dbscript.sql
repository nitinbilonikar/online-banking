CREATE DATABASE online_banking;
\c online_banking;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
);

-- Accounts table
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    balance DECIMAL(10, 2) NOT NULL DEFAULT 0
);

-- Transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    account_id INT REFERENCES accounts(id),
    amount DECIMAL(10, 2),
    type VARCHAR(50), -- e.g., 'payment', 'deposit', 'withdrawal'
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Beneficiaries table
CREATE TABLE beneficiaries (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    beneficiary_name VARCHAR(100),
    beneficiary_account VARCHAR(100) UNIQUE
);
