const tweetdb = require("../../model/Tweets")
const constant = require("./constant")
const utils = require("../../utils")

/**
 * for ALL tweets (latest tweet with pagination)
 * @param {object} whereData 
 * @param {Array} includeData 
 * @param {Array} orderData 
 * @param {Integer} oset 
 */
exports.allLatestTweets = async (whereData, includeData, orderData, oset) => {
    const { count, rows } = await tweetdb.findAndCountAll({
        where: whereData,
        include: includeData,
        order: orderData,
        offset: oset,
        limit: constant.limitTweets
    })
    return utils.classResponse(true, rows, "")
}


/**
 * create New tweet
 * @param {object} createData 
 */
exports.createTweet = async (createData) => {
    const newTweet = await tweetdb.create(createData)
    return utils.classResponse(true, newTweet, "")
}


/**
 * gets all tweets to read
 * @param {object} whereData 
 * @param {Array} orderData 
 */
exports.readTweet = async (whereData, orderData) => {
    const tweets = await tweetdb.findAll({
        where: whereData,
        order: orderData
    })
    return utils.classResponse(true, tweets, "")
}


/**
 * Updates tweet
 * @param {object} updateData 
 * @param {object} whereData 
 */
exports.updateTweet = async (updateData, whereData) => {
    const updateTweet = await tweetdb.update(updateData, {
        where: whereData
    })
    return utils.classResponse(true, updateTweet, "")
}


/**
 * Gets specific tweet along with all comments with user name of users who commented on it
 * @param {object} whereData 
 * @param {Array} includeData 
 * @param {Array} orderData 
 * @param {Integer} oset 
 */
exports.allTweetCommentsWithUser = async (whereData, includeData, orderData, oset) => {
    const { count, rows } = await tweetdb.findAndCountAll({
        where: whereData,
        include: includeData,
        order: orderData,
        offset: oset,
        limit: constant.limitTweets
    })
    return utils.classResponse(true, rows, "")
}
