const express = require('express')
const app = express()
const exphbs = require('express-handlebars');

require('./config/mongoose')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(3000, (req, res) => {
  console.log('Running on http://localhost:3000')
})



