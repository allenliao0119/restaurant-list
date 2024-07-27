const express = require('express')
const router = express.Router()

const db = require('../models')
const Restaurant = db.Restaurant

const restaurants = require('./restaurants')

router.use('/restaurants', restaurants)

router.get('/', (req, res, error) => {
  return Restaurant.findAll({
    attributes: ['id', 'name', 'category', 'image', 'rating'],
    raw: true
  })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => {
      error.errorMsg = '資料取得錯誤'
      next(error)
    })
})

module.exports = router
