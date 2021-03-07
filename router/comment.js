const express = require("express")
const Router = express.Router()
const commentFunc = require("../controller/comment")
const jwtAuth = require("../jwtAuth")

//create Tweet comment
Router.post("/create", jwtAuth.authenticateToken,commentFunc.createComment)

//Read tweet
Router.get("/read", jwtAuth.authenticateToken,commentFunc.readComment)

//for update comment
Router.post("/update", jwtAuth.authenticateToken,commentFunc.updateComment)

//for Delete Comment
Router.post("/delete", jwtAuth.authenticateToken,commentFunc.deleteComment)

//All comments under tweets
Router.get("/all/in/tweets", jwtAuth.authenticateToken,commentFunc.allInComments)

//comments under tweet with pagination
Router.get("/tweets", jwtAuth.authenticateToken,commentFunc.commentsUnderTweets)


module.exports = Router