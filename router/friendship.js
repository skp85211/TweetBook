const express = require("express")
const Router = express.Router()

const friendshipFunc = require("../controller/friendship")
const jwtAuth = require("../controller/jwtAuth")

//Friend Request (creation of relation, status -> Pending(0))
Router.post("/friendRequest", jwtAuth.authenticateToken,friendshipFunc.friendRequest)

//friend Request Accept , changing status -> Accepted(1), action_id
Router.post("/friendAccept", jwtAuth.authenticateToken,friendshipFunc.friendRequestAccept)

//friend request rejected , status->2 (Blocked), update action_id
Router.post("/friendReject", jwtAuth.authenticateToken,friendshipFunc.friendRequestReject)

//gets tweets of user's friends
Router.get("/getTweets", jwtAuth.authenticateToken,friendshipFunc.friendsTweet)

//gets all friend request from different user that can be accepted or rejected
Router.post("/all/friendRequest", jwtAuth.authenticateToken,friendshipFunc.allFriendRequest)

module.exports = Router