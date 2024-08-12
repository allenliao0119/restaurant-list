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
  const userId = req.user.id
  const restaurant = req.body
  restaurant.userId = userId
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
  const userId = req.user.id
  const keyword = req.query.keyword.trim()
  const options = { attributes: ['id', 'name', 'category', 'image', 'rating'],
                    raw: true}
  if (keyword !== '') {
    options.where = {
      [Op.or]: [{ name: { [Op.like]: `%${keyword}%` } },
                { category: { [Op.like]: `%${keyword}%` } }],
      userId
    }
  } else options.where = { userId }
  return Restaurant.findAll(options)
    .then(restaurants => {
      if (restaurants.length === 0) {
        req.flash('error', '沒有搜尋到符合關鍵字的餐廳:(')
        res.locals.errorMsg = req.flash('error')
      }
      return res.render('index', { restaurants, keyword })})
    .catch(error => {
      error.errorMsg = '資料取得錯誤'
      next(error)
    })
})

router.get('/', (req, res) => {
  const userId = req.user.id
  return Restaurant.findAll({
    attributes: ['id', 'name', 'category', 'image', 'rating'],
    where: { userId },
    raw: true
  })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => {
      error.errorMsg = '資料取得錯誤'
      next(error)
    })
})

router.get('/:id', (req, res, next) => {
  const userId = req.user.id
  const id = req.params.id
  return Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'category', 'image', 'location', 'google_map', 'phone', 'description', 'userId'],
    raw: true
  })
    .then(restaurant => {
      if (!restaurant) {
        req.flash('error', '找不到資料')
        return res.redirect('/restaurants')
      }

      if (userId !== restaurant.userId) {
        req.flash('error', '權限不足')
        return res.redirect('/restaurants')
      } 
      return res.render('show', { restaurant })})
    .catch(error => {
      error.errorMsg = '資料取得錯誤'
      next(error)
    })
})

// update restaurant
router.get('/:id/edit', (req, res, next) => {
  const userId = req.user.id
  const id = req.params.id
  return Restaurant.findByPk(id, { raw: true })
    .then(restaurant => {

      if (!restaurant) {
        req.flash('error', '找不到資料')
        return res.redirect('/restaurants')
      }

      if (userId !== restaurant.userId) {
        req.flash('error', '權限不足')
        return res.redirect('/restaurants') 
      }

      return res.render('edit', { restaurant }) })
    .catch(error => {
      error.errorMsg = '資料取得錯誤'
      next(error)
    })
})

router.put('/:id', (req, res, next) => {
  const userId = req.user.id
  const id = req.params.id
  return Restaurant.findByPk(id)
    .then(restaurant => {
      if (!restaurant) {
        req.flash('error', '找不到資料')
        return res.redirect('/restaurants')
      }

      if (userId !== restaurant.userId) {
        req.flash('error', '權限不足')
        return res.redirect('/restaurants')
      }

      restaurant.update(req.body)
        .then(() => {
          req.flash('success', '修改成功！')
          res.redirect(`/restaurants/${id}`)
        })
    })
    .catch(error => {
      error.errorMsg = '修改錯誤'
      next(error)
    })
})

// delete restaurant
router.delete('/:id', (req, res, next) => {
  const userId = req.user.id
  const id = req.params.id
  return Restaurant.findByPk(id)
    .then(restaurant => {
      if (!restaurant) {
        req.flash('error', '找不到資料')
        return res.redirect('/restaurants')
      }

      if (userId !== restaurant.userId) {
        req.flash('error', '權限不足')
        return res.redirect('/restaurants')
      }

      restaurant.destroy()
        .then(() => {
          req.flash('success', '刪除成功！')
          return res.redirect(`/restaurants/`)
        })
    })
    .catch(error => {
      error.errorMsg = '刪除錯誤'
      next(error)
    })
})

module.exports = router
