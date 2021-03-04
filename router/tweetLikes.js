const express = require("express")
const Router = express.Router()
const tweetLikesFunc = require("../controller/tweetLikes")
const jwtAuth = require("../jwtAuth")

//Create tweetLikes entry, Likes a tweet
Router.get("/create/userid/:userid/tweetid/:tweetid/likeType/:likeType", jwtAuth.authenticateToken,tweetLikesFunc.createLike)

//Read tweetlikes 
Router.get("/read/userid/:userid/tweetid/:tweetid", jwtAuth.authenticateToken,tweetLikesFunc.readLike)

//delete like or dislike
Router.get("/delete/userid/:userid/tweetid/:tweetid", jwtAuth.authenticateToken,tweetLikesFunc.deleteLike)

//All user list who liked the tweet
Router.get("/all/users/tweetid/:tweetid", jwtAuth.authenticateToken,tweetLikesFunc.whoAllLikedTweet)

module.exports = Router