const { Op } = require("sequelize")
const User = require("../../model/User")
const Tweets = require("../../model/Tweets")

const utils = require("../../utils")


/**
 * search user with given email/phone number if exists or not
 * @param {Integer} reqUserid 
 * @param {String} reqEmailorName 
 * @returns 
 */
const searchUser = async (reqUserid, reqEmailorName) => {
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
    let userSearch = await User.findAll({
        where: whereData
    })
    return utils.classResponse(true, userSearch, "")
}


/**
 * search user with given email/phone number
 * @param {String} reqEmail 
 * @returns 
 */
const searchUserwithEmail = async (reqEmail) => {
    let whereData = {
        email: reqEmail
    }
    let userSearch = await User.findAll({
        where: whereData
    })
    return utils.classResponse(true, userSearch, "")
}


/**
 * search user with given id number if exists or not
 * @param {Integer} reqUserid 
 * @returns 
 */
const searchUserwithId = async (reqUserid) => {
    let whereData = {
        id: reqUserid
    }
    let userSearch = await User.findAll({
        where: whereData
    })
    return utils.classResponse(true, userSearch, "")
}


/**
 * Gets all tweets of one user with pagination
 * @param {Integer} userid 
 * @param {Integer} offsetValue 
 * @param {Integer} pageSize 
 * @returns 
 */
const usersTweet = async (userid, offsetValue, pageSize) => {
    let whereData = {
        id: userid
    }
    let includeData = [
        {
            model: Tweets, as: "tweets",
            offset: offsetValue,
            limit: pageSize
        }
    ]
    let { count, rows } = await User.findAndCountAll({
        where: whereData,
        include: includeData
    })
    return utils.classResponse(true, rows, "")
}

/**
 * Gets all users with all their tweets
 * @returns
 */
const allUsersAllTweets = async () => {
    let includeData = ["tweets"]
    let allUsersAllTweets = await User.findAll({ include: includeData })
    return utils.classResponse(true, allUsersAllTweets, "")
}

/**
 * register and insert user details
 * @param {String} reqName 
 * @param {String} reqEmail 
 * @param {String} reqPassword 
 * @returns 
 */
const signupUser = async (reqName, reqEmail, reqPassword) => {
    let createData = {
        name: reqName,
        email: reqEmail,
        password: reqPassword
    }
    let signup = await User.create(createData)
    return utils.classResponse(true, signup, "")
}


/**
 * update name of user
 * @param {String} reqName 
 * @param {Integer} reqUserid 
 * @returns 
 */
const updateName = async (reqName, reqUserid) => {
    let updateData = { name: reqName }
    let whereData = {
        id: reqUserid
    }
    let updatedData = await User.update(updateData, {
        where: whereData
    })
    return utils.classResponse(true, updatedData, "")
}


/**
 * update  password of user
 * @param {String} reqNewPassword 
 * @param {Integer} reqUserid 
 * @returns 
 */
const updatePassword = async (reqNewPassword, reqUserid) => {
    let updateData = { password: reqNewPassword }
    let whereData = {
        id: reqUserid
    }
    let updatedData = await User.update(updateData, {
        where: whereData
    })
    return utils.classResponse(true, updatedData, "")
}

module.exports = { searchUser, searchUserwithEmail, searchUserwithId, usersTweet, allUsersAllTweets, signupUser, updateName, updatePassword }