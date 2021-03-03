const express = require("express")
const Router = express.Router()
const tweetFunc = require("../controller/tweets")

//for ALL tweets (latest tweet with pagination)
Router.get("/all/:uid/:pageno", tweetFunc.allLatestTweets)

//For Create
Router.post("/create", tweetFunc.createTweet)

//for Read
Router.post("/read", tweetFunc.readTweet)

//for update
Router.post("/update", tweetFunc.updateTweet)

//All tweets with all comments along with user name
Router.get("/alltry/:tid/:pageno", tweetFunc.allTweetCommentsWithUser)

module.exports = Router