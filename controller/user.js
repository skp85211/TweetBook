const friendshipClass = require("../classes/Friendship/Friendship")
const userClass = require("../classes/User/User")
const TEXT = require("../text").TEXT
const utils = require("../utils");
const userFunction = require("../classes//User/Function")
const ERRORS = require('../errorConstants').ERRORS
const constantFile = require("../classes/User/Constant")
const jwtauth = require("../jwtAuth")

/**
 * search user with email/phone and friendship relation and return details
 * @param {object} req 
 * @param {object} res 
 */
exports.searchUser = async (req, res) => {
    let reqEmailorName = req.body.email
    reqEmailorName = reqEmailorName.toString()
    let reqUserid = parseInt(req.body.userid)
    let errors = userFunction.emptySearchField(reqEmailorName, reqUserid)
    if (errors.length) {
        return utils.sendResponse(res,false, {}, errors.join(","))
    }
    try {
        let userSearchResponse = await userClass.searchUser(reqUserid, reqEmailorName)
        let userSearchArray = userSearchResponse.data
        if (userSearchArray.length == 0) {
            let data = { relationStatus: false }
            return utils.sendResponse(res,false, data, TEXT.noUser)
        }
        for (const userSearch of userSearchArray) {
            console.log(userSearch.name)
            const searchid = userSearch.id
            const searchEmail = userSearch.email
            const searchName = userSearch.name
            let userid1 = reqUserid
            let userid2 = searchid
            if (userid1 > userid2) {
                let temp = userid1
                userid1 = userid2
                userid2 = temp
            }
            const userRelationSearchResponse = await friendshipClass.friendshipCheck(userid1, userid2)
            const userRelationSearch = userRelationSearchResponse.data
            if (userRelationSearch.length == 0) {
                userSearch["friends"] = {
                    relationStatus: false,
                    id: searchid,
                    name: searchName,
                    email: searchEmail,
                }
            }
            else {
                userSearch["friends"] = {
                    relationStatus: true,
                    status: true,
                    id: searchid,
                    name: searchName,
                    email: searchEmail,
                    message: TEXT.InRelation,
                    data: userRelationSearch[0]
                }
            }
        }
        return utils.sendResponse(res,true, userSearchArray, "")
    } catch (error) {
        return utils.sendResponse(res,false, {}, error)
    }
}


/**
 * Gets all tweets of particular user with pagination
 * @param {object} req 
 * @param {object} res 
 */
exports.usersAllTweets = async (req, res) => {
    try {
        let pageno = parseInt(req.body.pagenum);
        pageno = pageno - 1;
        let pageSize = parseInt(req.body.pagesize);
        let offsetValue = (pageno * pageSize);
        let userid = parseInt(req.body.userid)
        let errors = userFunction.emptyusersAllTweets(pageno, pageSize, userid)
        if (errors.length) {
            return utils.sendResponse(res,false, {}, errors.join(","))
        }
        const rowsRecordResponse = await userClass.usersTweet(userid, offsetValue, pageSize)
        const rowsRecord = rowsRecordResponse.data
        return utils.sendResponse(res,true, rowsRecord, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}

/**
 * gets all user including all their tweets
 * @param {object} req 
 * @param {object} res 
 */
exports.allUsersAllTweets = async (req, res) => {
    let includeData = ["tweets"]
    try {
        const allUsersAllTweetsResponse = await userClass.allUsersAllTweets(includeData)
        const allUsersAllTweets = allUsersAllTweetsResponse.data
        return utils.sendResponse(res,true, allUsersAllTweets, "")
    } catch (error) {
        return utils.sendResponse(res,false, {}, error)
    }
}

/**
 * Verify email/phone number of user if it exists or not
 * @param {object} req 
 * @param {object} res 
 */
exports.emailVerification = async (req, res) => {
    let reqEmail = req.body.email.toString()
    let errors = []
    if (!reqEmail) {
        errors.push(TEXT.noEmail)
    }
    if (errors.length) {
        return utils.sendResponse(res, false, {}, errors.join(","))
    }
    try {
        let loginEmailResponse = await userClass.searchUserwithEmail(reqEmail)
        let loginEmail = loginEmailResponse.data
        if (loginEmail.length == 0) {
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
 */
exports.loginPasswordAuth = async (req, res) => {
    let reqEmail = req.body.email.toString()
    let reqPassword = req.body.password.toString()
    let errors = userFunction.emptyLoginField(reqEmail, reqPassword)
    if (errors.length) {
        return utils.sendResponse(res, false, {}, errors.join(","))
    }
    try {
        let loginResponse = await userClass.searchUserwithEmail(reqEmail)
        let login = loginResponse.data[0]
        if (login.length == 0) {
            return utils.sendResponse(res, false, {}, TEXT.noUserExists)
        }
        if (login.password != reqPassword) {
            return utils.sendResponse(res, false, {}, ERRORS.noPasswordMatch)
        }
        else {
            console.log(login.id, "id")
            const accessToken = jwtauth.generateAccessToken(login.id)
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
 */
exports.signupUser = async (req, res) => {
    let reqName = req.body.name.toString()
    let reqEmail = req.body.email.toString()
    let reqPassword = req.body.password.toString()
    let errors = userFunction.emptySignupField(reqName, reqEmail, reqPassword)
    if (errors.length) {
        return utils.sendResponse(res, false, {}, errors.join(","))
    }
    try {
        let signupResponse = await userClass.signupUser(reqName, reqEmail, reqPassword)
        return utils.sendResponse(res, true, {}, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}

/**
 * Updates name or password
 * @param {object} req 
 * @param {object} res 
 */
exports.updateNamePassword = async (req, res) => {
    //updating Name
    let reqType = parseInt(req.params.type)
    if (!reqType) {
        return utils.sendResponse(res, false, {}, TEXT.noUpdateType)
    }
    if (req.params.type == constantFile.updateTypeName) {
        let reqUserid = parseInt(req.body.userid)
        let reqName = req.body.name.toString()
        let reqPassword = req.body.password.toString()
        let errors = userFunction.emptyUpdateName(reqUserid, reqName, reqPassword)
        if (errors.length) {
            return utils.sendResponse(res, false, {}, errors.join(","))
        }

        try {
            let loginResponse = await userClass.searchUserwithId(reqUserid)
            let login = loginResponse.data[0]
            if (login.password != reqPassword) {
                return utils.sendResponse(res, false, {}, ERRORS.noPasswordMatch)
            }
            else {
                const updateName = await userClass.updateName(reqName, reqUserid)
                return utils.sendResponse(res, true, {}, "")
            }
        } catch (error) {
            return utils.sendResponse(res, false, {}, error)
        }
    }
    //updating password
    if (req.params.type == constantFile.updateTypePassword) {
        let reqUserid = parseInt(req.body.userid)
        let reqPassword = req.body.password.toString()
        let reqNewPassword = req.body.newpassword.toString()
        let errors = userFunction.emptyUpdatePassword(reqUserid, reqPassword, reqNewPassword)
        if (errors.length) {
            return utils.sendResponse(res, false, {}, errors.join(","))
        }
        try {
            let loginResponse = await userClass.searchUserwithId(reqUserid)
            let login = loginResponse.data[0]
            if (login.password != reqPassword) {
                return utils.sendResponse(res, false, {}, ERRORS.noPasswordMatch)
            }
            else {
                const updatePasswordResponse = await userClass.updatePassword(reqNewPassword, reqUserid)
                return utils.sendResponse(res, true, {}, "")
            }
        } catch (error) {
            return utils.sendResponse(res, false, {}, error)
        }
    }
}
