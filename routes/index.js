const express = require('express')
const router = express.Router()

const passport = require('passport')

const register = require('./register')
const login = require('./login')
const logout = require('./logout')
const restaurants = require('./restaurants')

const authHandler = require('../middlewares/auth-handler')

router.use('/register', register)
router.use('/login', login)
router.use('/logout', logout)
router.use('/restaurants', authHandler, restaurants)

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/restaurants')
  }
  return res.redirect('/login')
})

router.get('/oauth2/redirect/facebook', passport.authenticate('facebook',{
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  failureFlash: true
})) 

module.exports = router
