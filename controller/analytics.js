const utils = require("../utils")

/**
 * get all analytics 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 */
exports.analytics = async(req, res, next) => {
    console.log(req.body.analyticsObject, "All analytics details")
    return utils.sendResponse(res,true, {}, "")
}