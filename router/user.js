const express = require("express")
const Router = express.Router()
const userFunc = require("../controller/user")

//search user with email/phone and friendship relation and return details
Router.post("/search", userFunc.searchUser)

//pagination=> pageno, pagesize , gets all tweets of user
Router.post("/tweetPage", userFunc.usersAllTweets)

//for all user including all their tweets
Router.get("/AllTweets/", userFunc.allUsersAllTweets)


//for Email/phone number Verification
Router.post("/email/", userFunc.emailVerification)

//for login password authorisation
Router.post("/login/", userFunc.loginPasswordAuth)

//for signup
Router.post("/signup/", userFunc.signupUser)

//updating name or password
Router.post("/update/:type", userFunc.updateNamePassword)

module.exports = Router