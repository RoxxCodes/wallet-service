const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const Wallet = sequelize.define("Wallet", {
    id: { 
        type: DataTypes.STRING, 
        primaryKey: true, 
        allowNull: false, 
        unique: true, 
        defaultValue: () => uuidv4() // ✅ Generate UUID
    },
    name: { type: DataTypes.STRING, allowNull: false },
    balance: { type: DataTypes.DECIMAL(10, 4), allowNull: false, defaultValue: 0.0000 },
}, { timestamps: true });

module.exports = Wallet;