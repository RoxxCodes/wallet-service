const express = require("express");
const { setupWallet, getWallet } = require("../service/walletService");

const router = express.Router();
router.post("/setup", setupWallet);
router.get("/:id", getWallet);

module.exports = router;
