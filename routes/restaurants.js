const express = require('express')
const router = express.Router()

const db = require('../models')
const Restaurant = db.Restaurant

// create restaurant
router.get('/new', (req, res) => {
  try {
    res.render('new', { errorMsg: req.flash('error') })
  }
  catch (error) {
    console.log(error)
    req.flash('error', '系統錯誤')
    res.redirect('back')
  }
})

router.post('/', (req, res) => {
  try {
    const restaurant = req.body
    return Restaurant.create(restaurant)
      .then(() => {
        req.flash('success', '新增成功!')
        res.redirect('/')
      })
      .catch(error => {
        console.log(error)
        req.flash('error', '新增失敗:(')
        res.redirect('back')
      })
  }
  catch (error) {
    console.log(error)
    req.flash('error', '系統錯誤')
    res.redirect('back')
  }

})

// read restaurant
router.get('/:id', (req, res) => {
  try {
    const id = req.params.id
    return Restaurant.findByPk(id, {
      attributes: ['id', 'name', 'category', 'image', 'location', 'google_map', 'phone', 'description'],
      raw: true
    })
      .then(restaurant => res.render('show', { restaurant, successMsg: req.flash('success') }))
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

// update restaurant
router.get('/:id/edit', (req, res) => {
  try {
    const id = req.params.id
    return Restaurant.findByPk(id, { raw: true })
      .then(restaurant => { res.render('edit', { restaurant }) })
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

router.put('/:id', (req, res) => {
  try {
    const id = req.params.id
    const restaurant = req.body
    return Restaurant.update(restaurant, { where: { id } })
      .then(() => {
        req.flash('success', '修改成功！')
        res.redirect(`/restaurants/${id}`)
      })
      .catch(error => {
        console.log(error)
        req.flash('error', '修改錯誤')
        res.redirect('back')
      })
  }
  catch (error) {
    console.log(error)
    req.flash('error', '系統錯誤')
    res.redirect('back')
  }

})

// delete restaurant
router.delete('/:id', (req, res) => {
  try {
    const id = req.params.id
    return Restaurant.destroy({ where: { id } })
      .then(() => {
        req.flash('success', '刪除成功！')
        res.redirect('/')
      })
      .catch(error => {
        console.log(error)
        req.flash('error', '刪除錯誤')
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