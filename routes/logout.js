const express = require('express')
const router = express.Router()

const passport = require('passport')

// logout
router.post('/', (req, res, next) => {
  req.logout(error => {
    if (error) next(error)
    return res.redirect('/login')
  })
})

module.exports = router