const express = require("express");
const { transact, getTransactions } = require("../service/transactionService");

const router = express.Router();
router.post("/:walletId", transact);
router.get("/", getTransactions);

module.exports = router;
