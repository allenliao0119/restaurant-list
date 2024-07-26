const express = require('express')
const router = express.Router()

const db = require('../models')
const Restaurant = db.Restaurant

const restaurants = require('./restaurants')

router.use('/restaurants', restaurants)

router.get('/', (req, res) => {
  try {
    return Restaurant.findAll({
      attributes: ['id', 'name', 'category', 'image', 'rating'],
      raw: true
    })
      .then(restaurants => res.render('index', {
        restaurants,
        successMsg: req.flash('success'),
        errorMsg: req.flash('error')
      }))
      .catch(error => {
        console.log(error)
        req.flash('error', '資料取得錯誤')
        res.redirect('back')
      })
  }
  catch (error) {
    console.log(error)
    req.flash('error', '系統錯誤')
    res.redirect('back')
  }

})

module.exports = router