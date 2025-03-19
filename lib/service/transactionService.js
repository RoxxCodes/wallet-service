const { sequelize } = require("../config/db");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const BigNumber = require('bignumber.js');
const logger = require("../utils/logger");

const transact = async (req, res) => {
    const { walletId } = req.params;
    const { amount, description } = req.body;

    logger.info(`Transaction request, walletId: ${walletId}, amount: ${amount}, description: ${description}`)

    const t = await sequelize.transaction();
    try {
        if (!amount || new BigNumber(amount).isZero()) {
            throw new Error("Amount is invalid");
        }

        const wallet = await Wallet.findByPk(walletId, { lock: t.LOCK.UPDATE, transaction: t });
        if (!wallet) throw new Error("Wallet not found");

        const walletBalance = new BigNumber(wallet.balance);
        const transactionAmount = new BigNumber(amount);
        const newBalance = walletBalance.plus(transactionAmount);
        if (newBalance.isNegative()) throw new Error("Insufficient funds");

        const transaction = await Transaction.create(
            { 
                walletId, 
                amount: transactionAmount.toFixed(),
                balance: newBalance.toFixed(),
                description,
                type: amount > 0 ? "CREDIT" : "DEBIT" 
            },
            { transaction: t }
        );

        await Wallet.update(
            { balance: newBalance.toFixed() },
            { where: { id: walletId }, transaction: t }
        );

        await t.commit();
        res.json(transaction);
    } catch (error) {
        await t.rollback();
        logger.error(`Error while making transactions: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

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
