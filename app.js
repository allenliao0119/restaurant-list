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
  try {
    res.render('new', { errorMsg: req.flash('error') })
  }
  catch (error) {
    console.log(error)
    req.flash('error', '系統錯誤')
    res.redirect('back')
  }
})

app.post('/restaurants/', (req, res) => {
  try{
    const restaurant = req.body
    return Restaurant.create(restaurant)
      .then(() => {
        req.flash('success', '新增成功!')
        res.redirect('/')
      })
      .catch(error => {
        console.log(error)
        req.flash('error', '新增失敗:(')
        res.redirect('back')
      })
  }
  catch(error) {
    console.log(error)
    req.flash('error', '系統錯誤')
    res.redirect('back')
  }
  
})

// read restaurant
app.get('/', (req, res) => { // modify route "/restaurants" to "/" to take this page as index page
  try {
    return Restaurant.findAll({
      attributes: ['id', 'name', 'category', 'image', 'rating'],
      raw: true
    })
      .then(restaurants => res.render('index', {
        restaurants,
        successMsg: req.flash('success'),
        errorMsg: req.flash('error')
      }))
      .catch(error => {
        console.log(error)
        req.flash('error', '資料取得錯誤')
        res.redirect('back')
      })
  }
  catch(error) {
    console.log(error)
    req.flash('error', '系統錯誤')
    res.redirect('back')
  }
  
})

app.get('/restaurants/:id', (req, res) => {
  try {
    const id = req.params.id
    return Restaurant.findByPk(id, {
      attributes: ['id', 'name', 'category', 'image', 'location', 'google_map', 'phone', 'description'],
      raw: true
    })
      .then(restaurant => res.render('show', { restaurant, successMsg: req.flash('success') }))
      .catch(error => {
        console.log(error)
        req.flash('error', '資料取得錯誤')
        res.redirect('back')
      })
  }
  catch (error) {
    console.log(error)
    req.flash('error', '系統錯誤')
    res.redirect('back')
  }
  
})

// update restaurant
app.get('/restaurants/:id/edit', (req, res) => {
  try {
    const id = req.params.id
    return Restaurant.findByPk(id, { raw: true })
      .then(restaurant => {res.render('edit', { restaurant })})
      .catch(error => {
        console.log(error)
        req.flash('error', '資料取得錯誤')
        res.redirect('back')
      })
  }
  catch (error) {
    console.log(error)
    req.flash('error', '系統錯誤')
    res.redirect('back')
  }
  
})

app.put('/restaurants/:id', (req, res) => {
  try {
    const id = req.params.id
    const restaurant = req.body
    return Restaurant.update(restaurant, { where: { id } })
      .then(() => {
        req.flash('success', '修改成功！')
        res.redirect(`/restaurants/${id}`)
      })
      .catch(error => {
        console.log(error)
        req.flash('error', '修改錯誤')
        res.redirect('back')
      })
  }
  catch (error) {
    console.log(error)
    req.flash('error', '系統錯誤')
    res.redirect('back')
  }
  
})

// delete restaurant
app.delete('/restaurants/:id', (req, res) => {
  try {
    const id = req.params.id
    return Restaurant.destroy({ where: { id } })
      .then(() => {
        req.flash('success', '刪除成功！')
        res.redirect('/')
      })
      .catch(error => {
        console.log(error)
        req.flash('error', '刪除錯誤')
        res.redirect('back')
      })
  }
  catch (error) {
    console.log(error)
    req.flash('error', '系統錯誤')
    res.redirect('back')
  }
  
})

// ----- start to listen on port -----
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}.`)
})
