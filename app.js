const express = require('express')
const app = express()
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const Shortener = require('./models/shortener');
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'));

require('./config/mongoose')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

const routes = require('./routes')
app.use(routes)

app.listen(3000, (req, res) => {
  console.log('Running on http://localhost:3000')
})



