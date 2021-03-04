const express = require('express')
const router = express.Router()
router.use('/user', require("./user"))
router.use('/tweets', require("./tweets"))
router.use('/comments', require('./comment'))
router.use('/friendship', require("./friendship"))
router.use('/tweetLikes', require("./tweetLikes"))
router.use('/commentLikes', require("./commentLikes"))
router.use('/analytics', require('./analytics'))

module.exports = router