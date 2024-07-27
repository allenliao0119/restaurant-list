const express = require('express')
const router = express.Router()

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
      res.redirect('/')
    })
    .catch(error => {
      error.errorMsg = '新增失敗:('
      next(error)
    })
})

// read restaurant
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
      res.redirect('/')
    })
    .catch(error => {
      error.errorMsg = '刪除錯誤'
      next(error)
    })
})

module.exports = router
