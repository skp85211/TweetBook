const utils = require("../utils")

const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

const User = require("../classes/User/User")
const ERRORS = require("../errorConstants").ERRORS

dotenv.config()

/**
 * Generates JWT Token
 * @param {Integer} userid 
 */
exports.generateAccessToken = (userid) => {
    const token = jwt.sign(userid, process.env.TOKEN_SECRET)
    return token
}

/**
 * Authenticate JWT Token and verifies if user id exists or not
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next 
 */
exports.authenticateToken = async(req, res, next) => {
    let jwtToken = req.headers["access-token"]
    await jwt.verify(jwtToken, process.env.TOKEN_SECRET, async (err, decoded) => {
        if(err){
            console.log("Error : "+ err)
        }
        let userid = decoded
        console.log(userid, ",,,,,,")
        let checkUserIdExists = await User.checkUserIdExists(userid)
        if (checkUserIdExists.success == false) {
            return utils.sendResponse(res, false, {}, ERRORS.dbError)
        }
        if(checkUserIdExists.data.length == 0){
            return utils.sendResponse(res, false, {}, ERRORS.noUserExists)
        }
        req.userid = decoded
    })
    next()
}
