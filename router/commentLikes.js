const express = require("express")
const Router = express.Router()
const commentLikesFunc = require("../controller/commentLikes")
const jwtAuth = require("../controller/jwtAuth")

//Create commentLikes entry, Likes a comment
Router.post("/create", jwtAuth.authenticateToken,commentLikesFunc.createLike)

//Read commentlikes 
Router.get("/read", jwtAuth.authenticateToken,commentLikesFunc.readLike)

//delete like or dislike
Router.post("/delete", jwtAuth.authenticateToken,commentLikesFunc.deleteLike)

//All user list who liked the comment
Router.get("/all/users", jwtAuth.authenticateToken,commentLikesFunc.whoAllLikedcomment)


module.exports = Router