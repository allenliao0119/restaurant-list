const express = require('express')
const router = express.Router()

const passport = require('passport')
const LocalStrategy = require('passport-local')

const db = require('../models')
const User = db.User

passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
  return User.findOne({
    attributes: ['id', 'name', 'email', 'password'],
    where: {email: username},
    raw: true
  })
    .then(user => {
      if (user.password !== password) {
        return done(null, false, { message: '密碼錯誤'})
      }
      return done(null, user)
    })
    .catch(error => {
      error.errorMsg = '登入失敗'
      return done(error)
    })
}))

passport.serializeUser((user, done) => {
  const {id, name, email} = user
  return done(null, {id, name, email})
})

const restaurants = require('./restaurants')

router.use('/restaurants', restaurants)

router.get('/', (req, res) => {
  res.send('Hello World')
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

// login
router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  failureFlash: true
}))

// logout
router.post('/logout', (req, res, next) => {
  req.logout(error => {
    if (error) next(error)
    return res.redirect('/login')
  })
})

module.exports = router
