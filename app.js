// ----- require packages -----
const express = require('express')
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

// create restaurant
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants/', (req, res) => {
  const restaurant = req.body
  console.log(restaurant)
  return Restaurant.create(restaurant)
    .then(() => res.redirect('/'))
})

// read restaurant
app.get('/', (req, res) => { // modify route "/restaurants" to "/" to take this page as index page
  return Restaurant.findAll({
    attributes: ['id', 'name', 'category', 'image', 'rating'],
    raw: true
  })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => res.status(422).json(error))
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'category', 'image', 'location', 'google_map', 'phone', 'description'],
    raw: true
  })
    .then(restaurant => res.render('show', { restaurant }))
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
    .then(() => res.redirect(`/restaurants/${id}`))
})

// delete restaurant
app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.destroy({ where: { id } })
    .then(() => res.redirect('/'))
})

// ----- start to listen on port -----
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}.`)
})
