const { sequelize } = require("../config/db");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const logger = require("../utils/logger");

// Setup Wallet
const setupWallet = async (req, res) => {
    const { name, balance } = req.body;

    logger.info(`Creating wallet: ${name}, intialBal: ${balance}`);
    // ✅ Prevent negative balance wallets
    if (balance < 0) {
        return res.status(400).json({ error: "Wallet balance cannot be negative." });
    }

    const t = await sequelize.transaction(); // Start transaction

    try {
        // ✅ Create Wallet
        const wallet = await Wallet.create({ name, balance }, { transaction: t });

        // ✅ If balance > 0, create an initial transaction
        if (balance > 0) {
            await Transaction.create({
                walletId: wallet.id,
                amount: balance,
                balance: balance,
                description: "Initial Deposit",
                type: "CREDIT"
            }, { transaction: t });
        }

        await t.commit(); // Commit transaction
        res.status(201).json(wallet);
    } catch (error) {
        await t.rollback(); // Rollback on error
        logger.error(`Error creating wallet: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

// Get Wallet Details
const getWallet = async (req, res) => {
    try {
        logger.info(`Fetching wallet details: ${req.params.id}`);
        const wallet = await Wallet.findByPk(req.params.id);
        if (!wallet) return res.status(404).json({ error: "Wallet not found" });
        res.json(wallet);
    } catch (error) {
        logger.error(`Error fetching wallet: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

module.exports = { 
    setupWallet,
    getWallet 
};
