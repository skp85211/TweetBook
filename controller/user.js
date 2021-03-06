const User = require("../classes/User/User")

const utils = require("../utils");
const UserFunction = require("../classes//User/Function")
const TEXT = require("../text").TEXT
const ERRORS = require('../errorConstants').ERRORS
const ConstantFile = require("../classes/User/Constant")
const jwtauth = require("../jwtAuth")

/**
 * search user with email/phone and friendship relation and return details
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 */
exports.searchUser = async (req, res, next) => {
    let reqEmailorName = (req.body.email || "").toString()
    let reqUserid = parseInt(req.userid)
    let errors = UserFunction.emptySearchField(reqEmailorName, reqUserid)
    if (errors.length) {
        return utils.sendResponse(res,false, {}, errors.join(","))
    }
    try {
        let userSearchResponse = await User.searchUser(reqUserid, reqEmailorName)
        if (userSearchResponse.data.length == 0) {
            let data = { relationStatus: false }
            return utils.sendResponse(res,false, data, TEXT.noUser)
        }
        let userSearchArray = await UserFunction.userSearch(userSearchResponse.data, reqUserid)
        return utils.sendResponse(res,true, userSearchArray, "")
    } catch (error) {
        return utils.sendResponse(res,false, {}, error)
    }
}


/**
 * Gets all tweets of particular user with pagination
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 */
exports.usersAllTweets = async (req, res, next) => {
    try {
        let pageno = parseInt(req.body.pagenum);
        if(!pageno || isNaN(pageno)){
            pageno = ConstantFile.defaultPageNo
        }
        pageno = pageno - 1;
        let pageSize = parseInt(req.body.pagesize);
        if(!pageSize || isNaN(pageSize)){
            pageSize = ConstantFile.defaultPageSize
        }
        let offsetValue = (pageno * pageSize);
        let userid = parseInt(req.userid)
        let errors = UserFunction.emptyusersAllTweets(pageno, pageSize, userid)
        if (errors.length) {
            return utils.sendResponse(res,false, {}, errors.join(","))
        }
        let rowsRecord = await User.usersTweet(userid, offsetValue, pageSize)
        return utils.sendResponse(res,true, rowsRecord.data, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}

/**
 * gets all user including all their tweets
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 */
exports.allUsersAllTweets = async (req, res, next) => {
    try {
        let allUsersAllTweets = await User.allUsersAllTweets()
        return utils.sendResponse(res,true, allUsersAllTweets.data, "")
    } catch (error) {
        return utils.sendResponse(res,false, {}, error)
    }
}

/**
 * Verify email/phone number of user if it exists or not
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 */
exports.emailVerification = async (req, res, next) => {
    let reqEmail = (req.body.email || "").toString()
    let errors = []
    if (!reqEmail) {
        errors.push(TEXT.noEmail)
    }
    if (errors.length) {
        return utils.sendResponse(res, false, {}, errors.join(","))
    }
    try {
        let loginEmail = await User.searchUserwithEmail(reqEmail)
        if (loginEmail.data.length == 0) {
            return utils.sendResponse(res, false, {}, TEXT.noUserExists)
        }
        else {
            return utils.sendResponse(res, true, {}, "")
        }
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}

/**
 * Verify password of existing user from their email id
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 */
exports.loginPasswordAuth = async (req, res, next) => {
    let reqEmail = (req.body.email || "").toString()
    let reqPassword = (req.body.password || "").toString()
    let errors = UserFunction.emptyLoginField(reqEmail, reqPassword)
    if (errors.length) {
        return utils.sendResponse(res, false, {}, errors.join(","))
    }
    try {
        let loginResponse = await User.searchUserwithEmail(reqEmail)
        let login = loginResponse.data[0]
        if (login.length == 0) {
            return utils.sendResponse(res, false, {}, TEXT.noUserExists)
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
                token : accessToken
            }
            return utils.sendResponse(res, true, data, "")
        }
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}

/**
 * signup/ insert new user details
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 */
exports.signupUser = async (req, res, next) => {
    let reqName = (req.body.name || "").toString()
    let reqEmail = (req.body.email || "").toString()
    let reqPassword = (req.body.password || "").toString()
    let errors = UserFunction.emptySignupField(reqName, reqEmail, reqPassword)
    if (errors.length) {
        return utils.sendResponse(res, false, {}, errors.join(","))
    }
    try {
        await User.signupUser(reqName, reqEmail, reqPassword)
        return utils.sendResponse(res, true, {}, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}

/**
 * Updates name or password
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 */
exports.updateNamePassword = async (req, res, next) => {
    //updating Name
    let reqType = parseInt(req.params.type)
    if (!reqType) {
        return utils.sendResponse(res, false, {}, TEXT.noUpdateType)
    }
    if (req.params.type == ConstantFile.updateTypeName) {
        let reqUserid = parseInt(req.userid)
        let reqName = (req.body.name || "").toString()
        let reqPassword = (req.body.password || "").toString()
        let errors = UserFunction.emptyUpdateName(reqUserid, reqName, reqPassword)
        if (errors.length) {
            return utils.sendResponse(res, false, {}, errors.join(","))
        }

        try {
            let loginResponse = await User.searchUserwithId(reqUserid)
            let login = loginResponse.data[0]
            if (login.password != reqPassword) {
                return utils.sendResponse(res, false, {}, ERRORS.noPasswordMatch)
            }
            else {
                await User.updateName(reqName, reqUserid)
                return utils.sendResponse(res, true, {}, "")
            }
        } catch (error) {
            return utils.sendResponse(res, false, {}, error)
        }
    }
    //updating password
    if (req.params.type == ConstantFile.updateTypePassword) {
        let reqUserid = parseInt(req.userid)
        let reqPassword = (req.body.password || "").toString()
        let reqNewPassword = (req.body.newpassword || "").toString()
        let errors = UserFunction.emptyUpdatePassword(reqUserid, reqPassword, reqNewPassword)
        if (errors.length) {
            return utils.sendResponse(res, false, {}, errors.join(","))
        }
        try {
            let loginResponse = await User.searchUserwithId(reqUserid)
            let login = loginResponse.data[0]
            if (login.password != reqPassword) {
                return utils.sendResponse(res, false, {}, ERRORS.noPasswordMatch)
            }
            else {
                await User.updatePassword(reqNewPassword, reqUserid)
                return utils.sendResponse(res, true, {}, "")
            }
        } catch (error) {
            return utils.sendResponse(res, false, {}, error)
        }
    }
}
