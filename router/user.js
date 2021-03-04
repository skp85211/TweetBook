const express = require("express")
const Router = express.Router()
const userFunc = require("../controller/user")
const jwtAuth = require("../jwtAuth")

//search user with email/phone and friendship relation and return details
Router.post("/search", jwtAuth.authenticateToken,userFunc.searchUser)

//pagination=> pageno, pagesize , gets all tweets of user
Router.post("/tweetPage", jwtAuth.authenticateToken,userFunc.usersAllTweets)

//for all user including all their tweets
Router.get("/AllTweets/", jwtAuth.authenticateToken,userFunc.allUsersAllTweets)


//for Email/phone number Verification
Router.post("/email/", userFunc.emailVerification)

//for login password authorisation
Router.post("/login/", userFunc.loginPasswordAuth)

//for signup
Router.post("/signup/", userFunc.signupUser)

//updating name or password
Router.post("/update/:type", jwtAuth.authenticateToken,userFunc.updateNamePassword)

module.exports = Router