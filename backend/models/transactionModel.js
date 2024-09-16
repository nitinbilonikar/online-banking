const pool = require('../db/pool');

const createTransaction = async (accountId, amount, type) => {
    const result = await pool.query(
        `INSERT INTO transactions (account_id, amount, type) VALUES ($1, $2, $3) RETURNING *`,
        [accountId, amount, type]
    );
    return result.rows[0];
};

const getTransactionsByAccountId = async (accountId) => {
    const result = await pool.query(`SELECT * FROM transactions WHERE account_id = $1`, [accountId]);
    return result.rows;
};

module.exports = { createTransaction, getTransactionsByAccountId };
