const express = require("express")
const Router = express.Router()
const tweetFunc = require("../controller/tweets")
const jwtAuth = require("../jwtAuth")
//for ALL tweets (latest tweet with pagination)
Router.get("/all/:uid/:pageno", jwtAuth.authenticateToken,tweetFunc.allLatestTweets)

//For Create
Router.post("/create", jwtAuth.authenticateToken,tweetFunc.createTweet)

//for Read
Router.post("/read", jwtAuth.authenticateToken,tweetFunc.readTweet)

//for update
Router.post("/update", jwtAuth.authenticateToken,tweetFunc.updateTweet)

//All tweets with all comments along with user name
Router.get("/alltry/:tid/:pageno", jwtAuth.authenticateToken,tweetFunc.allTweetCommentsWithUser)

module.exports = Router