const tweetdb = require("../model/Tweets")
const friendshipClass = require("../classes/Friendship/Friendship")
const userClass = require("../classes/User/User")

const TEXT = require("../text").TEXT
const utils = require("../utils");
const userFunction = require("../classes//User/Function")
const { ERRORS } = require('../errorConstants');
const constantFile = require("../classes/User/Constant")

/**
 * search user with email/phone and friendship relation and return details
 * @param {object} req 
 * @param {object} res 
 */
exports.searchUser = async(req, res) => {
    let reqEmail = req.body.email
    reqEmail = reqEmail.toString()
    let reqUserid = parseInt(req.body.uid)
    let errors = userFunction.emptySearchField(reqEmail, reqUserid)
    if (errors.length) {
        return res.send(utils.sendResponse(false, "", errors.join(",")))
    }
    try {
        let whereData = {
            email: reqEmail
        }
        const userSearchResponse = await userClass.searchUser(whereData)
        const userSearch = userSearchResponse.data
        if (userSearch == null) {
            let data = { relationStatus: false }
            res.send(utils.sendResponse(false, data, TEXT.noUser))
        }
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
        let whereDataRelation = {
            user1_id: userid1,
            user2_id: userid2
        }
        const userRelationSearchResponse = await friendshipClass.friendshipCheck(whereDataRelation)
        const userRelationSearch = userRelationSearchResponse.data
        if (userRelationSearch.length == 0) {
            let data = {
                relationStatus: false,
                id: searchid,
                name: searchName,
                email: searchEmail,
            }
            res.send(utils.sendResponse(true, data, TEXT.noRelation))
        }
        else {
            let data = {
                relationStatus: true,
                status: true,
                id: searchid,
                name: searchName,
                email: searchEmail,
                message: TEXT.InRelation,
                data: userRelationSearch[0]
            }
            res.send(utils.sendResponse(true, data, ""))
        }
    } catch (error) {
        res.send(utils.sendResponse(false, "", error));
    }
}


/**
 * Gets all tweets of particular user with pagination
 * @param {object} req 
 * @param {object} res 
 */
exports.usersAllTweets = async(req, res) => {
    try {
        let pageno = parseInt(req.body.pagenum);
        pageno = pageno - 1;
        let pageSize = parseInt(req.body.pagesize);
        let offsetValue = (pageno * pageSize);
        let userid = parseInt(req.body.id)
        let errors = userFunction.emptyusersAllTweets(pageno, pageSize, userid)
        if (errors.length) {
            return res.send(utils.sendResponse(false, "", errors.join(",")))
        }
        let whereData = {
            id: userid
        }
        let includeData = [
            {
                model: tweetdb, as: "tweets",
                offset: offsetValue,
                limit: pageSize
            }
        ]

        const rowsRecordResponse = await userClass.usersTweet(whereData, includeData)
        const rowsRecord = rowsRecordResponse.data
        res.send(utils.sendResponse(true, rowsRecord, ""))
    } catch (error) {
        res.send(utils.sendResponse(false, "", error))
    }
}

/**
 * gets all user including all their tweets
 * @param {object} req 
 * @param {object} res 
 */
exports.allUsersAllTweets = async(req, res) => {
    let includeData = ["tweets"]
    try {
        const allUsersAllTweetsResponse = await userClass.allUsersAllTweets(includeData)
        const allUsersAllTweets = allUsersAllTweetsResponse.data
        res.send(utils.sendResponse(true, allUsersAllTweets, ""))
    } catch (error) {
        res.send(utils.sendResponse(false, "", error))
    }
}

/**
 * Verify email/phone number of user if it exists or not
 * @param {object} req 
 * @param {object} res 
 */
exports.emailVerification = async(req, res) => {
    let reqEmail = req.body.email.toString()
    let errors = []
    if (!reqEmail) {
        errors.push(TEXT.noEmail)
    }
    if (errors.length) {
        return res.send(utils.sendResponse(false, "", errors.join(",")))
    }
    let whereData = {
        email: reqEmail
    }
    try {
        let loginEmailResponse = await userClass.searchUser(whereData)
        let loginEmail = loginEmailResponse.data
        if (loginEmail.length == 0) {
            res.send(utils.sendResponse(false, "", TEXT.noUserExists))
        }
        else {
            res.send(utils.sendResponse(true, "", ""))
        }
    } catch (error) {
        res.send(utils.sendResponse(false, "", error))
    }
}

/**
 * Verify password of existing user from their email id
 * @param {object} req 
 * @param {object} res 
 */
exports.loginPasswordAuth = async(req, res) => {
    let reqEmail = req.body.email.toString()
    let reqPassword = req.body.password.toString()
    let errors = userFunction.emptyLoginField(reqEmail, reqPassword)
    if (errors.length) {
        return res.send(utils.sendResponse(false, "", errors.join(",")))
    }
    try {
        let whereData = {
            email: reqEmail
        }
        let loginResponse = await userClass.searchUser(whereData)
        let login = loginResponse.data
        if (login.length == 0) {
            res.send(utils.sendResponse(false, "", TEXT.noUserExists))
        }
        if (login.password != reqPassword) {
            res.send(utils.sendResponse(false, "", ERRORS.noPasswordMatch))
        }
        else {
            let data = {
                userId: login.id,
                name: login.name,
                email: login.email
            }
            res.send(utils.sendResponse(true, data, ""))
        }
    } catch (error) {
        res.send(utils.sendResponse(false, "", error))
    }
}

/**
 * signup/ insert new user details
 * @param {object} req 
 * @param {object} res 
 */
exports.signupUser = async(req, res) => {
    let reqName = req.body.name.toString()
    let reqEmail = req.body.email.toString()
    let reqPassword = req.body.password.toString()
    let errors = userFunction.emptySignupField(reqName, reqEmail, reqPassword)
    if (errors.length) {
        return res.send(utils.sendResponse(false, "", errors.join(",")))
    }
    let createData = {
        name: reqName,
        email: reqEmail,
        password: reqPassword
    }
    try {
        let signupResponse = await userClass.signupUser(createData)
        res.send(utils.sendResponse(true, "", ""))
    } catch (error) {
        res.send(utils.sendResponse(false, "", error))
    }
}

/**
 * Updates name or password
 * @param {object} req 
 * @param {object} res 
 */
exports.updateNamePassword = async(req, res) => {
    //updating Name
    let reqType = parseInt(req.params.type)
    if(!reqType){
        return res.send(utils.sendResponse(false, "", TEXT.noUpdateType))
    }
    if (req.params.type == constantFile.updateTypeName) {
        let reqUserid = parseInt(req.body.uid)
        let reqName = req.body.name.toString()
        let reqPassword = req.body.password.toString()
        let errors = userFunction.emptyUpdateName(reqUserid, reqName, reqPassword)
        if (errors.length) {
            return res.send(utils.sendResponse(false, "", errors.join(",")))
        }

        try {
            let whereData = {
                id: reqUserid
            }
            let loginResponse = await userClass.searchUser(whereData)
            let login = loginResponse.data
            if (login.password != reqPassword) {
                res.send(utils.sendResponse(false, "", ERRORS.noPasswordMatch))
            }
            else {
                let updateData = { name: reqName }
                let whereData = {
                    id: reqUserid
                }
                const updateName = await userClass.updateNamePassword(updateData, whereData)
                res.send(utils.sendResponse(true, "", ""))
            }
        } catch (error) {
            res.send(utils.sendResponse(false, "", error));
        }
    }
    //updating password
    if (req.params.type == constantFile.updateTypePassword) {
        let reqUserid = parseInt(req.body.uid)
        let reqPassword = req.body.password.toString()
        let reqNewPassword = req.body.newpassword.toString()
        let errors = userFunction.emptyUpdatePassword(reqUserid, reqPassword, reqNewPassword)
        if (errors.length) {
            return res.send(utils.sendResponse(false, "", errors.join(",")))
        }
        try {
            let whereData = {
                id: reqUserid
            }
            let loginResponse = await userClass.searchUser(whereData)
            let login = loginResponse.data 
            if (login.password != reqPassword) {
                res.send(utils.sendResponse(false, "", ERRORS.noPasswordMatch))
            }
            else {
                let whereData = {
                    id: reqUserid
                }
                let updateData = { password: reqNewPassword }

                const updatePasswordResponse = await userClass.updateNamePassword(updateData, whereData)
                res.send(utils.sendResponse(true, "", ""))
            }
        } catch (error) {
            res.send(utils.sendResponse(false, "", error));
        }
    }
}
