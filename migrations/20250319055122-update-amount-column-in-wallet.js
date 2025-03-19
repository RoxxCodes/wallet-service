'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("Wallets", "balance", {
      type: Sequelize.DECIMAL(22, 4),
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn("Wallets", "balance", {
      type: Sequelize.DECIMAL(10, 4),
    });
  }
};
