const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User

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

passport.serializeUser((user, done) => {
  const { id, name, email } = user
  return done(null, { id, name, email })
})

passport.deserializeUser((user, done) => {
  return done(null, { id: user.id })
})

module.exports = passport