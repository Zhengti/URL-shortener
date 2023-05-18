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

app.get('/', (req, res) => {
  res.render('index')
})


// 判斷是否已縮短過的網址
app.post('/shorteners', (req, res) => {
  const originalURL = req.body.inputURL;
  Shortener.findOne({ originalURL: originalURL })
    .lean()
    .then(existingShortener => {
      if (existingShortener) {
        // 如果已存在相同的URL，直接回傳現有的縮網址資料
        return res.render('newURL', { Shortener: existingShortener });
      } else {
        // 如果不存在相同的URL，則新增縮網址資料
        const randomURL = randomWords();
        const newShortener = new Shortener({ originalURL, randomURL, })
        return newShortener.save()
          .then(createdShortener => {
            res.redirect(`/newURL-page?shortenerId=${createdShortener._id}`);
          })
          .catch(error => console.log(error));
      }
    })
    .catch(error => console.log(error));
});

// 新建立的網址顯示的頁面路由，
app.get('/newURL-page', (req, res) => {
  const shortenerId = req.query.shortenerId;
  // 根據縮網址的 ID 查詢縮網址資料
  Shortener.findById(shortenerId)
    .lean()
    .then(Shortener => {
      if (Shortener) {
        res.render('newURL', { Shortener });
      } else {
        // 縮網址不存在，顯示錯誤頁面
        res.redirect('/error');
      }
    })
    .catch(error =>
      console.log(error));
});

// 導向原始網址的路由
app.get('/yuncut/:randomURL', (req, res) => {
  const randomURL = req.params.randomURL
  return Shortener.findOne({ randomURL: randomURL })
    .lean()
    .then(shortener => {
      if (shortener) {
        res.redirect(shortener.originalURL);
      } else {
        // 縮短網址不存在，顯示錯誤頁面
        res.redirect('/error');
      }
    })
    .catch(error => console.log(error))
})

// 隨機碼產生函式
function randomWords() {
  let results = '';
  const baseWords = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 5; i++) {
    results += baseWords[Math.floor(Math.random() * baseWords.length)];
  }
  // 過濾undefined的錯誤
  if (results.includes(undefined)) {
    return randomWords()
  }
  return results
}

app.listen(3000, (req, res) => {
  console.log('Running on http://localhost:3000')
})



