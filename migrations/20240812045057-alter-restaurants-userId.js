'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Restaurants', 'userId', {
      allowNull: false,
      type: Sequelize.INTEGER
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Restaurants', 'userId', {
      allowNull: true,
      type: Sequelize.INTEGER
    })
  }
};
