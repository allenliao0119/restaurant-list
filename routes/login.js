const express = require('express')
const router = express.Router()

const passport = require('passport')

// login
router.get('/', (req, res) => {
  res.render('login')
})

router.post('/', passport.authenticate('local', {
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  failureFlash: true
}))

module.exports = router