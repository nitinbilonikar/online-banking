const express = require('express');
const verifyToken = require('../middleware/auth');
const { addBeneficiary, getBeneficiariesByUserId } = require('../models/beneficiaryModel');

const router = express.Router();

router.post('/beneficiaries', verifyToken, async (req, res) => {
    const { amount } = req.body;

    try {
        const beneficiary = await getBeneficiariesByUserId(req.user.id);
        if (beneficiary.beneficiaryName == null ) return res.status(400).send('Invalid beneficiary');
        res.json(beneficiary);
    } catch (err) {
        res.status(500).send('Error adding beneficiary');
    }
});
