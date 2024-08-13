const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/redirect/facebook', passport.authenticate('facebook', {
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  failureFlash: true
}))

module.exports = router