const express = require("express")
const Router = express.Router()
const tweetLikesFunc = require("../controller/tweetLikes")
const jwtAuth = require("../controller/jwtAuth")

//Create tweetLikes entry, Likes a tweet
Router.post("/create", jwtAuth.authenticateToken,tweetLikesFunc.createLike)

//Read tweetlikes 
Router.get("/read", jwtAuth.authenticateToken,tweetLikesFunc.readLike)

//delete like or dislike
Router.post("/delete", jwtAuth.authenticateToken,tweetLikesFunc.deleteLike)

//All user list who liked the tweet
Router.get("/all/users", tweetLikesFunc.whoAllLikedTweet)

module.exports = Router