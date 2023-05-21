const express = require('express')
const router = express.Router()
const Shortener = require('../models/shortener')
const utilitiesRandomURL = require('../utilities/randomURL')

// 首頁路由
router.get('/', (req, res) => {
  res.render('index')
})

// 判斷使用者輸入的網址的路由
router.post('/shorteners', (req, res) => {
  const originalURL = req.body.inputURL;
  // 先檢查是否為有效網址
  if (!originalURL.includes('https://')) {
    return res.render('error')

    // 有效網址 - 繼續處理資料
  } else {
    Shortener.findOne({ originalURL: originalURL })
      .lean()
      .then(existingShortener => {
        // 如果已存在相同的URL，直接回傳現有的縮網址資料
        if (existingShortener) {
          return res.render('newURL', { Shortener: existingShortener });
        } else {
          // 如果不存在相同的URL，則新增縮網址資料
          const randomURL = utilitiesRandomURL()
          // const randomURL = randomWords();
          const newShortener = new Shortener({ originalURL, randomURL, })
          return newShortener.save()
            .then(createdShortener => {
              // 這裡無法直接res.render('newURL', { createdShortener })會無法成功渲染縮網址，因此導向另一個路由來渲染頁面
              res.redirect(`/newURL-page?shortenerId=${createdShortener._id}`);
            })
            .catch(error => console.log(error));
        }
      })
      .catch(error => console.log(error));
  }
});

// 不存在相同的URL，在新增縮網址資料後渲染頁面的路由
router.get('/newURL-page', (req, res) => {
  const shortenerId = req.query.shortenerId;
  // 根據縮網址的 ID 查詢縮網址資料
  Shortener.findById(shortenerId)
    .lean()
    .then(Shortener => {
      if (Shortener) {
        res.render('newURL', { Shortener });
      }
    })
    .catch(error =>
      console.log(error));
});

// 導向原始網址的路由
router.get('/yuncut/:randomURL', (req, res) => {
  const randomURL = req.params.randomURL
  return Shortener.findOne({ randomURL: randomURL })
    .lean()
    .then(shortener => {
      if (shortener) {
        res.redirect(shortener.originalURL);
      } else {
        // 縮短網址不存在，顯示錯誤頁面
        res.render('error');
      }
    })
    .catch(error => console.log(error))
})

// 隨機碼產生函式
// function randomWords() {
//   let results = '';
//   const baseWords = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
//   for (let i = 0; i < 5; i++) {
//     results += baseWords[Math.floor(Math.random() * baseWords.length)];
//   }
//   // 過濾undefined的錯誤
//   if (results.includes(undefined)) {
//     return randomWords()
//   }
//   return results
// }

module.exports = router