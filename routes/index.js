const express = require('express')
const router = express.Router()

const passport = require('passport')

const root = require('./root')
const register = require('./register')
const login = require('./login')
const logout = require('./logout')
const restaurants = require('./restaurants')
const oauth = require('./oauth')

const authHandler = require('../middlewares/auth-handler')

router.use(root)
router.use('/register', register)
router.use('/login', login)
router.use('/logout', logout)
router.use('/oauth2', oauth)
router.use('/restaurants', authHandler, restaurants)

module.exports = router
