// ----- require packages -----
const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()

const { engine } = require('express-handlebars')
app.engine('hbs', engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.set('views', './views')

const methodOverride = require('method-override')

const db = require('./models')
const Restaurant = db.Restaurant

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

// create restaurant
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants/', (req, res) => {
  const restaurant = req.body
  console.log(restaurant)
  return Restaurant.create(restaurant)
    .then(() => {
      req.flash('success', '新增成功!')
      res.redirect('/')})
})

// read restaurant
app.get('/', (req, res) => { // modify route "/restaurants" to "/" to take this page as index page
  return Restaurant.findAll({
    attributes: ['id', 'name', 'category', 'image', 'rating'],
    raw: true
  })
    .then(restaurants => res.render('index', { restaurants, successMsg: req.flash('success')}))
    .catch(error => res.status(422).json(error))
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'category', 'image', 'location', 'google_map', 'phone', 'description'],
    raw: true
  })
    .then(restaurant => res.render('show', { restaurant, successMsg: req.flash('success') }))
})

// update restaurant
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findByPk(id, { raw: true })
    .then(restaurant => res.render('edit', { restaurant }))
})

app.put('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const restaurant = req.body
  return Restaurant.update(restaurant, { where: { id } })
    .then(() => {
      req.flash('success', '修改成功！')
      res.redirect(`/restaurants/${id}`)})
})

// delete restaurant
app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.destroy({ where: { id } })
    .then(() => {
      req.flash('success', '刪除成功！')
      res.redirect('/')})
})

// ----- start to listen on port -----
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}.`)
})
