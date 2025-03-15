'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("Transactions", {
      id: { 
        type: Sequelize.STRING, 
        primaryKey: true, 
        allowNull: false, 
        unique: true 
      },
      walletId: { 
        type: Sequelize.STRING,
        allowNull: false,
        references: { model: "Wallets", key: "id" }, // ✅ Foreign key reference
        onDelete: "CASCADE"
      },
      amount: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: false
      },
      balance: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: false
      },
      description: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.ENUM("CREDIT", "DEBIT"),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("Transactions");
  }
};
