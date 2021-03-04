const { sendResponse } = require("../utils")

/**
 * get all analytics 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.analytics = async(req, res) => {
    console.log(req.body.analyticsObject, "All analytics details")
    return res.send(sendResponse(true, "", ""))
}