const utils = require("../../utils")

const { Op } = require("sequelize")

const Tweets = require("../../model/Tweets")
const User = require("../../model/User")
const Comment = require("../../model/Comments")

const Constant = require("./Constant").Constant

/**
 * for ALL tweets (latest tweet with pagination)
 * @param {Integer} reqUserid 
 * @param {Integer} oset 
 * @returns 
 */
const allLatestTweets = async (reqUserid, oset) => {
    try {
        let { count, rows } = await Tweets.findAndCountAll({
            where: {
                uid:{
                    [Op.ne] : reqUserid
                }
            },
            include: [
                {
                    model:User, as:"user",
                    attributes:['id', 'name']
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            offset: oset,
            limit: Constant.limitTweets
        })
        return utils.classResponse(true, rows, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

/**
 * create New tweet
 * @param {Integer} reqUserid 
 * @param {String} reqTweet 
 * @returns 
 */
const createTweet = async (reqUserid, reqTweet) => {
    try {
        let newTweet = await Tweets.create({
            uid: reqUserid, 
            tweet: reqTweet
        })
        return utils.classResponse(true, newTweet, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
    
}

/**
 * gets all tweets to read
 * @param {Integer} reqUserid 
 * @returns 
 */
const readTweet = async (reqUserid) => {
    try {
        let tweets = await Tweets.findAll({
            where: {
                uid:reqUserid
            },
            order: [
                ['createdAt', 'DESC']
            ]
        })
        return utils.classResponse(true, tweets, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    } 
    
}

/**
 * Updates tweet
 * @param {Integer} reqId 
 * @param {Integer} reqUserid 
 * @param {String} reqTweet 
 * @returns 
 */
const updateTweet = async (reqId, reqUserid, reqTweet) => {
    try {
        let updateTweet = await Tweets.update({tweet : reqTweet}, {
            where: {
                id: reqId,
                uid: reqUserid
            }
        })
        return utils.classResponse(true, updateTweet, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
    
}

/**
 * Delete comments from database
 * @param {Integr} reqId
 * @param {Integer} reqUserid 
 * @returns 
 */
 const deleteTweet = async (reqId, reqUserid) => {
    try {
        let deleteTweet = await Tweets.destroy({
            where: {
                id: reqId,
                uid: reqUserid
            }
        })
        return utils.classResponse(true, deleteTweet, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

/**
 * Gets specific tweet along with all comments with user name of users who commented on it
 * @param {Integer} tweetid 
 * @param {Integer} oset 
 * @returns 
 */
const allTweetCommentsWithUser = async (tweetid, oset) => {
    try {
        let { count, rows } = await Tweets.findAndCountAll({
            where: {
            id:{
                [Op.eq] : tweetid
            }
        },
            include: [
                {
                    model:Comment, as:"comments",
                    include : [
                        {
                            model:User, as:"user",
                            attributes:['id', 'name']
                        }
                    ]
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            offset: oset,
            limit: Constant.limitTweets
        })
        return utils.classResponse(true, rows, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

module.exports = { allLatestTweets, createTweet, readTweet, updateTweet, deleteTweet, allTweetCommentsWithUser }