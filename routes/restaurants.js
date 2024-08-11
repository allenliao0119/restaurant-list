const express = require('express')
const router = express.Router()

const { Op } = require('sequelize')

const db = require('../models')
const Restaurant = db.Restaurant

// create restaurant
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res, next) => {
  const restaurant = req.body
  return Restaurant.create(restaurant)
    .then(() => {
      req.flash('success', '新增成功!')
      res.redirect('/restaurants')
    })
    .catch(error => {
      error.errorMsg = '新增失敗:('
      next(error)
    })
})

// read restaurant
router.get('/search', (req, res, next) => {
  const keyword = req.query.keyword.trim()
  const options = { attributes: ['id', 'name', 'category', 'image', 'rating'],
                    raw: true}
  if (keyword !== '') {
    options.where = {
      [Op.or]: [{ name: { [Op.like]: `%${keyword}%` } },
                { category: { [Op.like]: `%${keyword}%` } }]
    }
  }
  return Restaurant.findAll(options)
    .then(restaurants => {
      res.render('index', { restaurants, keyword })})
    .catch(error => {
      error.errorMsg = '資料取得錯誤'
      next(error)
    })
})

router.get('/', (req, res) => {
  console.log(req.session)
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

router.get('/:id', (req, res, next) => {
  const id = req.params.id
  return Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'category', 'image', 'location', 'google_map', 'phone', 'description'],
    raw: true
  })
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => {
      error.errorMsg = '資料取得錯誤'
      next(error)
    })
})

// update restaurant
router.get('/:id/edit', (req, res, next) => {
  const id = req.params.id
  return Restaurant.findByPk(id, { raw: true })
    .then(restaurant => { res.render('edit', { restaurant }) })
    .catch(error => {
      error.errorMsg = '資料取得錯誤'
      next(error)
    })
})

router.put('/:id', (req, res, next) => {
  const id = req.params.id
  const restaurant = req.body
  return Restaurant.update(restaurant, { where: { id } })
    .then(() => {
      req.flash('success', '修改成功！')
      res.redirect(`/restaurants/${id}`)
    })
    .catch(error => {
      error.errorMsg = '修改錯誤'
      next(error)
    })
})

// delete restaurant
router.delete('/:id', (req, res, next) => {
  const id = req.params.id
  return Restaurant.destroy({ where: { id } })
    .then(() => {
      req.flash('success', '刪除成功！')
      res.redirect('/restaurants')
    })
    .catch(error => {
      error.errorMsg = '刪除錯誤'
      next(error)
    })
})

module.exports = router
