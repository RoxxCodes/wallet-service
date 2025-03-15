const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Wallet = require("./Wallet");
const { v4: uuidv4 } = require("uuid");

const Transaction = sequelize.define("Transaction", {
    id: { 
        type: DataTypes.STRING, 
        primaryKey: true, 
        allowNull: false, 
        unique: true, 
        defaultValue: () => uuidv4() // ✅ Generate UUID
    },
    walletId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Wallet, key: "id" }},
    amount: { type: DataTypes.DECIMAL(10, 4), allowNull: false },
    balance: { type: DataTypes.DECIMAL(10, 4), allowNull: false },
    description: { type: DataTypes.STRING },
    type: { type: DataTypes.ENUM("CREDIT", "DEBIT"), allowNull: false },
}, { timestamps: true });

Wallet.hasMany(Transaction, { foreignKey: "walletId" });
Transaction.belongsTo(Wallet, { foreignKey: "walletId" });

module.exports = Transaction;
