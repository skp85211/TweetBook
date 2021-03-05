const userdb = require("../../model/User")
const utils = require("../../utils")
const { Op } = require("sequelize")
const tweetdb = require("../../model/Tweets")
/**
 * search user with given email/phone number if exists or not
 * @param {object} whereData 
 */
exports.searchUser = async (reqUserid, reqEmailorName) => {
    let whereData = {
        [Op.and]: [
            {
                [Op.or]: [
                    {
                        name: {
                            [Op.iLike]: '%' + reqEmailorName + '%'
                        }
                    },
                    {
                        email: reqEmailorName
                    }
                ]
            },
            {
                id: {
                    [Op.ne]: reqUserid
                }
            }
        ]
    }
    let userSearch = await userdb.findAll({
        where: whereData
    })
    return utils.classResponse(true, userSearch, "")
}


/**
 * search user with given email/phone number 
 * @param {object} whereData 
 */
exports.searchUserwithEmail = async (reqEmail) => {
    let whereData = {
        email: reqEmail
    }
    let userSearch = await userdb.findAll({
        where: whereData
    })
    return utils.classResponse(true, userSearch, "")
}

/**
 * search user with given id number if exists or not
 * @param {object} whereData 
 */
exports.searchUserwithId = async (reqUserid) => {
    let whereData = {
        id: reqUserid
    }
    let userSearch = await userdb.findAll({
        where: whereData
    })
    return utils.classResponse(true, userSearch, "")
}

/**
 * Gets all tweets of one user with pagination
 * @param {object} whereData 
 * @param {Array} includeData 
 */
exports.usersTweet = async (userid, offsetValue, pageSize) => {
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
    const { count, rows } = await userdb.findAndCountAll({
        where: whereData,
        include: includeData
    })
    return utils.classResponse(true, rows, "")
}

/**
 * Gets all users with all their tweets
 * @param {array} includeData 
 */
exports.allUsersAllTweets = async (includeData) => {
    const allUsersAllTweets = await userdb.findAll({ include: includeData })
    return utils.classResponse(true, allUsersAllTweets, "")
}

/**
 * register and insert user details
 * @param {Object} createData 
 */
exports.signupUser = async (reqName, reqEmail, reqPassword) => {
    let createData = {
        name: reqName,
        email: reqEmail,
        password: reqPassword
    }
    let signup = await userdb.create(createData)
    return utils.classResponse(true, signup, "")
}

/**
 * update name of user
 * @param {Object} updateData 
 * @param {Object} whereData 
 */
exports.updateName = async (reqName, reqUserid) => {
    let updateData = { name: reqName }
    let whereData = {
        id: reqUserid
    }
    const updatedData = await userdb.update(updateData, {
        where: whereData
    })
    return utils.classResponse(true, updatedData, "")
}

/**
 * update  password of user
 * @param {Object} updateData 
 * @param {Object} whereData 
 */
exports.updatePassword = async (reqNewPassword, reqUserid) => {
    let updateData = { password: reqNewPassword }
    let whereData = {
        id: reqUserid
    }
    const updatedData = await userdb.update(updateData, {
        where: whereData
    })
    return utils.classResponse(true, updatedData, "")
}