// ----- require packages -----
const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()
const passport = require('passport')

const handlebarsHelper = require('./helpers/handlebars-helper')
const { engine } = require('express-handlebars')
app.engine('hbs', engine({ defaultLayout: 'main', extname: '.hbs', helpers: handlebarsHelper }))
app.set('view engine', 'hbs')
app.set('views', './views')

const methodOverride = require('method-override')

const router = require('./routes')

const messageHandler = require('./middlewares/message-handler')
const errorHandler = require('./middlewares/error-handler')

// ----- define relative variables -----
const port = 3000

// ----- define routes -----
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: 'keyboard dog',
  resave: false,
  saveUninitialized: false
}))

app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

app.use(messageHandler)

app.use(router)

app.use(errorHandler)

// ----- start to listen on port -----
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}.`)
})
