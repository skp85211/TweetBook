const express = require("express")
const Router = express.Router()
const commentFunc = require("../controller/comment")

//create Tweet comment
Router.post("/create", commentFunc.createComment)

//Read tweet
Router.post("/read", commentFunc.readComment)

//for update comment
Router.post("/update", commentFunc.updateComment)

//for Delete Comment
Router.post("/delete", commentFunc.deleteComment)

//All comments under tweets
Router.get("/all/in/tweets", commentFunc.allInComments)

//comments under tweet with pagination
Router.get("/tweets/tweetid/:tweetid/userid/:userid/:pageno", commentFunc.commentsUnderTweets)


module.exports = Router