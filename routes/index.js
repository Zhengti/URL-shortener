const express = require('express')
const router = express.Router()
const shortener = require('./modules/shortener')
router.use('/', shortener)

module.exports = router