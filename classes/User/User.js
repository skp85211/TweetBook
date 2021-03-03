const userdb = require("../../model/User")
const utils = require("../../utils")

/**
 * search user with given email/phone number if exists or not
 * @param {object} whereData 
 */
exports.searchUser = async (whereData) => {
    const userSearch = await userdb.findOne({
        where: whereData
    })
    return utils.classResponse(true, userSearch, "")
}

/**
 * Gets all tweets of one user with pagination
 * @param {object} whereData 
 * @param {Array} includeData 
 */
exports.usersTweet = async (whereData, includeData) => {
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
exports.signupUser = async (createData) => {
    let signup = await userdb.create(createData)
    return utils.classResponse(true, signup, "")
}

/**
 * update name or password of user
 * @param {Object} updateData 
 * @param {Object} whereData 
 */
exports.updateNamePassword = async (updateData, whereData) => {
    const updatedData = await userdb.update(updateData, {
        where: whereData
    })
    return utils.classResponse(true, updatedData, "")
}
