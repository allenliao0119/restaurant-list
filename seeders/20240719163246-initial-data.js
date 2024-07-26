'use strict'
const seeds = require('../restaurant.json').results

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await (queryInterface.bulkInsert('Restaurants', seeds))
  },

  async down (queryInterface, Sequelize) {
    await (queryInterface.bulkDelete('Restaurants', null))
  }
}
