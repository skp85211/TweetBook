const utils = require("../../utils")

const { Op } = require("sequelize")

const User = require("../../model/User")
const Tweets = require("../../model/Tweets")

const ERRORS = require("../../errorConstants").ERRORS

/**
 * search user with given email/phone number if exists or not
 * @param {Integer} reqUserid 
 * @param {String} reqEmailorName 
 * @returns 
 */
const searchUser = async (reqUserid, reqEmailorName) => {
    try {
        let userSearch = await User.findAll({
            where: {
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
        })
        return utils.classResponse(true, userSearch, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

/**
 * Checks if user id exist or not
 * @param {Integer} reqUserid 
 * @returns 
 */
 const checkUserIdExists = async (reqUserid) => {
    try {
        let uidCheck = await User.findAll({
            attributes: ['id'],
            where: {
                id:reqUserid
            }
        })
        return utils.classResponse(true, uidCheck, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
    
}

/**
 * search user with given email/phone number
 * @param {String} reqEmail 
 * @returns 
 */
const searchUserwithEmail = async (reqEmail) => {
    try {
        let userSearch = await User.findAll({
            where: {
                email: reqEmail
            }
        })
        return utils.classResponse(true, userSearch, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

/**
 * search user with given id number if exists or not
 * @param {Integer} reqUserid 
 * @returns 
 */
const searchUserwithId = async (reqUserid) => {
    try {
        let userSearch = await User.findAll({
            where: {
                id: reqUserid
            }
        })
        return utils.classResponse(true, userSearch, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}


/**
 * Gets all tweets of one user with pagination
 * @param {Integer} userid 
 * @param {Integer} offsetValue 
 * @param {Integer} pageSize 
 * @returns 
 */
const usersTweet = async (userid, offsetValue, pageSize) => {
    try {
        let { count, rows } = await User.findAndCountAll({
            where:{
                id: userid
            },
            include: [
                {
                    model: Tweets, as: "tweets",
                    offset: offsetValue,
                    limit: pageSize
                }
            ]
        })
        return utils.classResponse(true, rows, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

/**
 * Gets all users with all their tweets
 * @returns
 */
const allUsersAllTweets = async () => {
    try {
        let allUsersAllTweets = await User.findAll({ include: ["tweets"] })
        return utils.classResponse(true, allUsersAllTweets, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

/**
 * register and insert user details
 * @param {String} reqName 
 * @param {String} reqEmail 
 * @param {String} reqPassword 
 * @returns 
 */
const signupUser = async (reqName, reqEmail, reqPassword) => {
    try {
        let signup = await User.create({
            name: reqName,
            email: reqEmail,
            password: reqPassword
        })
        return utils.classResponse(true, signup, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
    
}

/**
 * update name of user
 * @param {String} reqName 
 * @param {Integer} reqUserid 
 * @returns 
 */
const updateName = async (reqName, reqUserid) => { 
    try {
        let updatedData = await User.update({ name: reqName }, {
            where: {
                id: reqUserid
            }
        })
        return utils.classResponse(true, updatedData, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
    
}


/**
 * update  password of user
 * @param {String} reqNewPassword 
 * @param {Integer} reqUserid 
 * @returns 
 */
const updatePassword = async (reqNewPassword, reqUserid) => {
    try {
        let updatedData = await User.update({ password: reqNewPassword }, {
            where: {
                id: reqUserid
            }
        })
        return utils.classResponse(true, updatedData, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
    
}

module.exports = { searchUser, checkUserIdExists, searchUserwithEmail, searchUserwithId, usersTweet, allUsersAllTweets, signupUser, updateName, updatePassword }