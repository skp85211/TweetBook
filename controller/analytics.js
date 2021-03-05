const utils = require("../utils")

/**
 * get all analytics 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.analytics = async(req, res) => {
    console.log(req.body.analyticsObject, "All analytics details")
    return utils.sendResponse(res,true, {}, "")
}