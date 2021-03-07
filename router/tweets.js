const express = require("express")
const Router = express.Router()

const tweetFunc = require("../controller/tweets")
const jwtAuth = require("../jwtAuth")

//for ALL tweets (latest tweet with pagination)
Router.get("/all", jwtAuth.authenticateToken,tweetFunc.allLatestTweets)

//For Create
Router.post("/create", jwtAuth.authenticateToken,tweetFunc.createTweet)

//for Read
Router.get("/read", jwtAuth.authenticateToken,tweetFunc.readTweet)

//for update
Router.post("/update", jwtAuth.authenticateToken,tweetFunc.updateTweet)

//for delete
Router.post("/delete", jwtAuth.authenticateToken,tweetFunc.deleteTweet)

//All tweets with all comments along with user name
Router.get("/alltweetcomments", jwtAuth.authenticateToken,tweetFunc.allTweetCommentsWithUser)

module.exports = Router