// 隨機碼產生函式
module.exports = function randomWords() {
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