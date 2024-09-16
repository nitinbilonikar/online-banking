const pool = require('../db/pool');

const addBeneficiary = async (userId, beneficiaryName, beneficiaryAccount) => {
    const result = await pool.query(
        `INSERT INTO beneficiaries (user_id, beneficiary_name, beneficiary_account) VALUES ($1, $2, $3) RETURNING *`,
        [userId, beneficiaryName, beneficiaryAccount]
    );
    return result.rows[0];
};

const getBeneficiariesByUserId = async (userId) => {
    const result = await pool.query(`SELECT * FROM beneficiaries WHERE user_id = $1`, [userId]);
    return result.rows;
};

module.exports = { addBeneficiary, getBeneficiariesByUserId };
