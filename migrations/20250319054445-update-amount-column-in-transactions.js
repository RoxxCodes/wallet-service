'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("Transactions", "amount", {
      type: Sequelize.DECIMAL(22, 4),
    });

    await queryInterface.changeColumn("Transactions", "balance", {
      type: Sequelize.DECIMAL(22, 4),
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn("Transactions", "amount", {
      type: Sequelize.DECIMAL(10, 2),
    });

    await queryInterface.changeColumn("Transactions", "balance", {
      type: Sequelize.DECIMAL(10, 2),
    });
  }
};
