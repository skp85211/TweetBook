const { Op } = require("sequelize")

const Tweets = require("../../model/Tweets")
const User = require("../../model/User")
const Comment = require("../../model/Comments")

const Constant = require("./Constant").Constant
const utils = require("../../utils")

/**
 * for ALL tweets (latest tweet with pagination)
 * @param {Integer} reqUserid 
 * @param {Integer} oset 
 * @returns 
 */
const allLatestTweets = async (reqUserid, oset) => {
    let whereData = {
        uid:{
            [Op.ne] : reqUserid
        }
    }
    let includeData = [
        {
            model:User, as:"user",
            attributes:['id', 'name']
        }
    ]
    let orderData = [
        ['createdAt', 'DESC']
    ]
    let { count, rows } = await Tweets.findAndCountAll({
        where: whereData,
        include: includeData,
        order: orderData,
        offset: oset,
        limit: Constant.limitTweets
    })
    return utils.classResponse(true, rows, "")
}

/**
 * create New tweet
 * @param {Integer} reqUserid 
 * @param {String} reqTweet 
 * @returns 
 */
const createTweet = async (reqUserid, reqTweet) => {
    let createData = {
        uid: reqUserid, 
        tweet: reqTweet
    }
    let newTweet = await Tweets.create(createData)
    return utils.classResponse(true, newTweet, "")
}

/**
 * gets all tweets to read
 * @param {Integer} reqUserid 
 * @returns 
 */
const readTweet = async (reqUserid) => {
    let whereData = {
        uid:reqUserid
    }
    let orderData = [
        ['createdAt', 'DESC']
    ]
    let tweets = await Tweets.findAll({
        where: whereData,
        order: orderData
    })
    return utils.classResponse(true, tweets, "")
}

/**
 * Updates tweet
 * @param {Integer} reqId 
 * @param {Integer} reqUserid 
 * @param {String} reqTweet 
 * @returns 
 */
const updateTweet = async (reqId, reqUserid, reqTweet) => {
    let updateData = {tweet : reqTweet}
    let whereData = {
        id: reqId,
        uid: reqUserid
    }
    let updateTweet = await Tweets.update(updateData, {
        where: whereData
    })
    return utils.classResponse(true, updateTweet, "")
}

/**
 * Delete comments from database
 * @param {Integr} reqId
 * @param {Integer} reqUserid 
 * @returns 
 */
 const deleteTweet = async (reqId, reqUserid) => {
    let whereData = {
        id: reqId,
        uid: reqUserid
    }
    let deleteTweet = await Tweets.destroy({
        where: whereData
    })
    return utils.classResponse(true, deleteTweet, "")
}

/**
 * Gets specific tweet along with all comments with user name of users who commented on it
 * @param {Integer} tweetid 
 * @param {Integer} oset 
 * @returns 
 */
const allTweetCommentsWithUser = async (tweetid, oset) => {
    let whereData = {
        id:{
            [Op.eq] : tweetid
        }
    }
    let includeData = [
        {
            model:Comment, as:"comments",
            include : [
                {
                    model:User, as:"user",
                    attributes:['id', 'name']
                }
            ]
        }
    ]
    let orderData = [
        ['createdAt', 'DESC']
    ]
    let { count, rows } = await Tweets.findAndCountAll({
        where: whereData,
        include: includeData,
        order: orderData,
        offset: oset,
        limit: Constant.limitTweets
    })
    return utils.classResponse(true, rows, "")
}

module.exports = { allLatestTweets, createTweet, readTweet, updateTweet, deleteTweet, allTweetCommentsWithUser }