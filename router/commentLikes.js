const express = require("express")
const Router = express.Router()
const commentLikesFunc = require("../controller/commentLikes")

//Create commentLikes entry, Likes a comment
Router.get("/create/userid/:userid/commentid/:commentid/likeType/:likeType", commentLikesFunc.createLike)

//Read commentlikes 
Router.get("/read/userid/:userid/commentid/:commentid", commentLikesFunc.readLike)

//delete like or dislike
Router.get("/delete/userid/:userid/commentid/:commentid", commentLikesFunc.deleteLike)

//All user list who liked the comment
Router.get("/all/users/commentid/:commentid", commentLikesFunc.whoAllLikedcomment)


module.exports = Router