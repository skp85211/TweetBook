const utils = require("../utils");

const User = require("../classes/User/User")

const UserFunction = require("../classes//User/Function")
const TEXT = require("../text").TEXT
const ERRORS = require('../errorConstants').ERRORS
const ConstantFile = require("../classes/User/Constant").Constant
const jwtauth = require("./jwtAuth")

/**
 * search user with email/phone and friendship relation and return details
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 * @returns 
 */
exports.searchUser = async (req, res, next) => {
    let body = req.body
    let reqEmailorName = (body.email || "")
    let reqUserid = parseInt(req.userid)
    let errors = UserFunction.emptySearchField(reqEmailorName, reqUserid)
    if (errors.length) {
        return utils.sendResponse(res, false, {}, errors.join(","))
    }
    let userSearchResponse = await User.searchUser(reqUserid, reqEmailorName)
    if (userSearchResponse.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    if (userSearchResponse.data.length == 0) {
        let data = { relationStatus: false }
        return utils.sendResponse(res, false, data, ERRORS.noUser)
    }
    let userSearchArray = await UserFunction.userSearch(userSearchResponse.data, reqUserid)
    if (userSearchArray.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    return utils.sendResponse(res, true, userSearchArray, "")
}

/**
 * Gets all tweets of particular user with pagination
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 * @returns 
 */
exports.usersAllTweets = async (req, res, next) => {
    let pageno = parseInt(req.query.pagenum);
    if (!pageno || isNaN(pageno)) {
        pageno = ConstantFile.defaultPageNo
    }
    let pageSize = parseInt(req.query.pagesize);
    if (!pageSize || isNaN(pageSize)) {
        pageSize = ConstantFile.defaultPageSize
    }
    let userid = parseInt(req.userid)
    let errors = UserFunction.emptyusersAllTweets(pageno, pageSize, userid)
    if (errors.length) {
        return utils.sendResponse(res, false, {}, errors.join(","))
    }
    pageno = pageno - 1;
    let offsetValue = (pageno * pageSize);
    let rowsRecord = await User.usersTweet(userid, offsetValue, pageSize)
    if (rowsRecord.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    return utils.sendResponse(res, true, rowsRecord.data, "")
}

/**
 * gets all user including all their tweets
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 * @returns 
 */
exports.allUsersAllTweets = async (req, res, next) => {
    let allUsersAllTweets = await User.allUsersAllTweets()
    if (allUsersAllTweets.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    return utils.sendResponse(res, true, allUsersAllTweets.data, "")
}

/**
 * Verify email/phone number of user if it exists or not
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 * @returns 
 */
exports.emailVerification = async (req, res, next) => {
    let body = req.body
    let reqEmail = (body.email || "")
    let errors = []
    if (!reqEmail) {
        errors.push(TEXT.noEmail)
    }
    if (errors.length) {
        return utils.sendResponse(res, false, {}, errors.join(","))
    }
    let loginEmail = await User.searchUserwithEmail(reqEmail)
    if (loginEmail.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    if (loginEmail.data.length == 0) {
        return utils.sendResponse(res, false, {}, ERRORS.noUserExists)
    }
    else {
        return utils.sendResponse(res, true, {}, "")
    }
}

/**
 * Verify password of existing user from their email id
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 * @returns 
 */
exports.loginPasswordAuth = async (req, res, next) => {
    let body = req.body
    let reqEmail = (body.email || "")
    let reqPassword = (body.password || "")
    let errors = UserFunction.emptyLoginField(reqEmail, reqPassword)
    if (errors.length) {
        return utils.sendResponse(res, false, {}, errors.join(","))
    }
    let loginResponse = await User.searchUserwithEmail(reqEmail)
    if (loginResponse.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    let login = loginResponse.data[0]
    if (login.length == 0) {
        return utils.sendResponse(res, false, {}, ERRORS.noUserExists)
    }
    if (login.password != reqPassword) {
        return utils.sendResponse(res, false, {}, ERRORS.noPasswordMatch)
    }
    else {
        console.log(login.id, "id")
        let accessToken = jwtauth.generateAccessToken(login.id)
        let data = {
            userId: login.id,
            name: login.name,
            email: login.email,
            token: accessToken
        }
        return utils.sendResponse(res, true, data, "")
    }
}

/**
 * signup/ insert new user details
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 * @returns 
 */
exports.signupUser = async (req, res, next) => {
    let body = req.body
    let reqName = (body.name || "")
    let reqEmail = (body.email || "")
    let reqPassword = (body.password || "")
    let errors = UserFunction.emptySignupField(reqName, reqEmail, reqPassword)
    if (errors.length) {
        return utils.sendResponse(res, false, {}, errors.join(","))
    }
    let signupResponse = await User.signupUser(reqName, reqEmail, reqPassword)
    if (signupResponse.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    return utils.sendResponse(res, true, {}, "")
}

/**
 * Updates name or password
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 * @returns 
 */
exports.updateNamePassword = async (req, res, next) => {
    //updating Name
    let body = req.body
    let reqType = parseInt(body.type)
    if (!reqType) {
        return utils.sendResponse(res, false, {}, ERRORS.noUpdateType)
    }
    if (reqType == ConstantFile.updateTypeName) {
        let reqUserid = parseInt(req.userid)
        let reqName = (body.name || "")
        let reqPassword = (body.password || "")
        let errors = UserFunction.emptyUpdateName(reqUserid, reqName, reqPassword)
        if (errors.length) {
            return utils.sendResponse(res, false, {}, errors.join(","))
        }
        let loginResponse = await User.searchUserwithId(reqUserid)
        if (loginResponse.success == false) {
            return utils.sendResponse(res, false, {}, ERRORS.dbError)
        }
        let login = loginResponse.data[0]
        if (login.password != reqPassword) {
            return utils.sendResponse(res, false, {}, ERRORS.noPasswordMatch)
        }
        else {
            let updateNameResponse = await User.updateName(reqName, reqUserid)
            if (updateNameResponse.success == false) {
                return utils.sendResponse(res, false, {}, ERRORS.dbError)
            }
            return utils.sendResponse(res, true, {}, "")
        }
    }
    //updating password
    if (reqType == ConstantFile.updateTypePassword) {
        let reqUserid = parseInt(req.userid)
        let reqPassword = (body.password || "")
        let reqNewPassword = (body.newpassword || "")
        let errors = UserFunction.emptyUpdatePassword(reqUserid, reqPassword, reqNewPassword)
        if (errors.length) {
            return utils.sendResponse(res, false, {}, errors.join(","))
        }
        let loginResponse = await User.searchUserwithId(reqUserid)
        if (loginResponse.success == false) {
            return utils.sendResponse(res, false, {}, ERRORS.dbError)
        }
        let login = loginResponse.data[0]
        if (login.password != reqPassword) {
            return utils.sendResponse(res, false, {}, ERRORS.noPasswordMatch)
        }
        else {
            let updatePasswordResponse = await User.updatePassword(reqNewPassword, reqUserid)
            if (updatePasswordResponse.success == false) {
                return utils.sendResponse(res, false, {}, ERRORS.dbError)
            }
            return utils.sendResponse(res, true, {}, "")
        }
    }
}
