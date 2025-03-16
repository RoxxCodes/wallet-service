const { sequelize } = require("../config/db");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const logger = require("../utils/logger");

// Perform a Transaction (Credit/Debit)
const transact = async (req, res) => {
    const { walletId } = req.params;
    const { amount, description } = req.body;

    logger.info(`Transaction request, walletId: ${walletId}, amount: ${amount}, description: ${description}`);
    const t = await sequelize.transaction();
    try {
        const wallet = await Wallet.findByPk(walletId, { lock: t.LOCK.UPDATE, transaction: t });
        if (!wallet) throw new Error("Wallet not found");

        const newBalance = parseFloat(wallet.balance) + parseFloat(amount);
        if (newBalance < 0) throw new Error("Insufficient funds");

        await Wallet.update({ balance: newBalance }, { where: { id: walletId }, transaction: t });
        const transaction = await Transaction.create({ walletId, amount, balance: newBalance, description, type: amount > 0 ? "CREDIT" : "DEBIT" }, { transaction: t });

        await t.commit();
        res.json(transaction);
    } catch (error) {
        await t.rollback();
        logger.error(`Error while making transactions: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

// Fetch Transactions
const getTransactions = async (req, res) => {
   try {
    const { walletId, skip = 0, limit = 10 } = req.query;

    logger.info(`GET /transactions - walletId: ${walletId}, skip: ${skip}, limit: ${limit}`);

    if (!walletId) {
        return res.status(400).json({ success: false, message: "walletId is required" });
    }

    const offset = parseInt(skip, 10);
    const pageSize = parseInt(limit, 10);

    const { rows: transactions, count: totalRecords } = await Transaction.findAndCountAll({
        where: { walletId },
        limit: pageSize,
        offset,
        order: [["createdAt", "DESC"]],
    });

    const hasMore = offset + pageSize < totalRecords

    logger.info(`Transactions fetched - walletId: ${walletId}, count: ${transactions.length}`);

    res.json({
        walletId,
        currentPage: Math.floor(offset / pageSize) + 1,
        totalRecords,
        transactions,
        hasMore,
    });
   } catch (error) {
        logger.error(`Error fetching transactions: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal Server Error" });
   }
};

module.exports = {
    transact,
    getTransactions 
};
