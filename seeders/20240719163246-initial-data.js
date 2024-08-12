'use strict'

const passport = require('passport')
const bcrypt = require('bcryptjs')
const { sequelize } = require('../models')

const seeds = require('../restaurant.json').results
seeds.forEach(seed => {
  seed.userId = parseInt(seed.id) <= 4 ? 1 : 2
})

/** @type {import('sequelize-cli').Migration} */
module.exports = {  
  async up (queryInterface, Sequelize) {
    let transaction
    try {
      transaction = await queryInterface.sequelize.transaction()
      await (queryInterface.bulkInsert('Users', [
        {
          id: 1,
          email: 'user1@example.com',
          password: bcrypt.hashSync('12345678', 10),
        },
        {
          id: 2,
          email: 'user2@example.com',
          password: bcrypt.hashSync('12345678', 10),
        }], 
        { transaction }))
        
      await (queryInterface.bulkInsert('Restaurants', 
        seeds, 
        { transaction }))
      
      await transaction.commit()
    }
    catch (error) {
      console.log(error)
      await transaction.rollback()
    }
  },

  async down (queryInterface, Sequelize) {
    await (queryInterface.bulkDelete('Users', null))
  }
}
