const pool = require('../db/pool');

const getAccountByUserId = async (userId) => {
    const result = await pool.query(`SELECT * FROM accounts WHERE user_id = $1`, [userId]);
    return result.rows[0];
};

const updateAccountBalance = async (accountId, newBalance) => {
    const result = await pool.query(
        `UPDATE accounts SET balance = $1 WHERE id = $2 RETURNING *`,
        [newBalance, accountId]
    );
    return result.rows[0];
};

module.exports = { getAccountByUserId, updateAccountBalance };
