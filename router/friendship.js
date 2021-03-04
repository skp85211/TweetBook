const express = require("express")
const Router = express.Router()
const friendshipFunc = require("../controller/friendship")

//Friend Request (creation of relation, status -> Pending(0))
Router.get("/friendRequest/:userid1/:userid2", friendshipFunc.friendRequest)

//friend Request Accept , changing status -> Accepted(1), action_id
Router.get("/friendAccept/:userid1/:userid2", friendshipFunc.friendRequestAccept)

//friend request rejected , status->2 (Blocked), update action_id
Router.get("/friendReject/:userid1/:userid2", friendshipFunc.friendRequestReject)

//gets tweets of user's friends
Router.get("/getTweets/:uid/:pageno", friendshipFunc.friendsTweet)

//gets all friend request from different user that can be accepted or rejected
Router.post("/all/friendRequest", friendshipFunc.allFriendRequest)

module.exports = Router