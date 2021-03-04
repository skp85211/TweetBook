const express = require("express")
const Router = express.Router()

const analyticsFunc = require("../controller/analytics")

//get all analytics
Router.post("/all", analyticsFunc.analytics)

module.exports = Router