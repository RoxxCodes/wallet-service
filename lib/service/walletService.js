const { sequelize } = require("../config/db");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const logger = require("../utils/logger");

const setupWallet = async (req, res) => {
    const { name, balance } = req.body;
    const safeBalance = balance ?? 0;

    logger.info(`Creating wallet: ${name}, intialBal: ${balance}`);
    if (balance < 0) {
        return res.status(400).json({ error: "Wallet balance cannot be negative." });
    }

    const t = await sequelize.transaction();

    try {
        const wallet = await Wallet.create({ name, balance: safeBalance }, { transaction: t });

        if (safeBalance > 0) {
            await Transaction.create({
                walletId: wallet.id,
                amount: balance,
                balance: safeBalance,
                description: "Initial Deposit",
                type: "CREDIT"
            }, { transaction: t });
        }

        await t.commit();
        res.status(201).json(wallet);
    } catch (error) {
        await t.rollback();
        logger.error(`Error creating wallet: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

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
