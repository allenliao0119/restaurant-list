const express = require('express')
const router = express.Router()

const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant


const restaurants = require('./restaurants')

router.use('/restaurants', restaurants)

router.get('/', (req, res) => {
  res.send('Hello World')
})

// login
router.get('/login', (req, res) => {
  res.render('login')
})

// register
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res, next) => {
  const { email, name, password, checkPassword } = req.body

  if (email === '' || password === '') {
    req.flash('error', '帳號或密碼未填寫，再請確認')
    return res.redirect('back')
  }

  if (password !== checkPassword) {
    req.flash('error', '密碼與再次確認密碼輸入不同，再請確認')
    return res.redirect('back')
  }

  return User.findOrCreate({
    where: {email},
    defaults: { email, name, password }
  })
    .then(result => {
      const [ user, created ] = result
      if (!created) {
        req.flash('error', '帳號已註冊過')
        return res.redirect('back')
      }

      req.flash('success', '註冊成功！請重新登入')
      return res.redirect('/login')
    })
    .catch(error => {
      error.errorMsg = '註冊失敗'
      next(error)
    })
})

module.exports = router
