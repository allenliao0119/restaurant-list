const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')
const bcrypt = require('bcryptjs')

const db = require('../models')
const { where } = require('sequelize')
const User = db.User

// 帳號登入
passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
  return User.findOne({
    attributes: ['id', 'name', 'email', 'password'],
    where: { email: username },
    raw: true
  })
  .then(user => {
    if (!user) {
      return done(null, false, { message: '帳號不存在' })
    }

    return bcrypt.compare(password, user.password)
      .then(isMatched => {
        if (!isMatched) {
          return done(null, false, { message: '密碼錯誤' })
        }
        return done(null, user)
      })
  })
  .catch(error => {
    error.errorMsg = '登入失敗'
    done(error)
  })  
}))

// Facebook登入
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_REDIRECT_URL,
  profileFields: ['email', 'displayName']
}, (accessToken, refreshToken, profile, done) => {
  const name = profile.displayName
  const email = profile.emails[0].value

  return User.findOne( {
    attributes: ['id', 'name', 'email'],
    where: { email }
  })
    .then(user => {
      if (user) return done(null, user)
      console.log('create new')
      const randomPassword = Math.random().toString(36).slice(-8)

      return bcrypt.hash(randomPassword, 10)
        .then(hash => User.create({ name, email, password: hash }))
        .then(user => done(null, {id: user.id, name, email}))
    })
    .catch(error => {
      error.errorMsg = '登入失敗'
      return done(error)
    })
}))

passport.serializeUser((user, done) => {
  const { id, name, email } = user
  return done(null, { id, name, email })
})

passport.deserializeUser((user, done) => {
  return done(null, { id: user.id })
})

module.exports = passport