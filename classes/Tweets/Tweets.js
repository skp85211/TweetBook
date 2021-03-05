const tweetdb = require("../../model/Tweets")
const userdb = require("../../model/User")
const commentdb = require("../../model/Comments")
const constant = require("./constant")
const utils = require("../../utils")
const { Op } = require("sequelize")

/**
 * for ALL tweets (latest tweet with pagination)
 * @param {object} whereData 
 * @param {Array} includeData 
 * @param {Array} orderData 
 * @param {Integer} oset 
 */
exports.allLatestTweets = async (reqUserid, oset) => {
    let whereData = {
        uid:{
            [Op.ne] : reqUserid
        }
    }
    let includeData = [
        {
            model:userdb, as:"user",
            attributes:['id', 'name']
        }
    ]
    let orderData = [
        ['createdAt', 'DESC']
    ]
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
exports.createTweet = async (reqUserid, reqTweet) => {
    let createData = {
        uid: reqUserid, 
        tweet: reqTweet
    }
    const newTweet = await tweetdb.create(createData)
    return utils.classResponse(true, newTweet, "")
}


/**
 * gets all tweets to read
 * @param {object} whereData 
 * @param {Array} orderData 
 */
exports.readTweet = async (reqUserid) => {
    let whereData = {
        uid:reqUserid
    }
    let orderData = [
        ['createdAt', 'DESC']
    ]
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
exports.updateTweet = async (reqId, reqUserid, reqTweet) => {
    let updateData = {tweet : reqTweet}
    let whereData = {
        id: reqId,
        uid: reqUserid
    }
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
exports.allTweetCommentsWithUser = async (tweetid, oset) => {
    let whereData = {
        id:{
            [Op.eq] : tweetid
        }
    }
    let includeData = [
        {
            model:commentdb, as:"comments",
            include : [
                {
                    model:userdb, as:"user",
                    attributes:['id', 'name']
                }
            ]
        }
    ]
    let orderData = [
        ['createdAt', 'DESC']
    ]
    const { count, rows } = await tweetdb.findAndCountAll({
        where: whereData,
        include: includeData,
        order: orderData,
        offset: oset,
        limit: constant.limitTweets
    })
    return utils.classResponse(true, rows, "")
}
