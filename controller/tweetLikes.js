const userdb = require("../model/User")
const tweetLikesClass = require("../classes/TweetLikes/TweetLikes")
const utils = require("../utils")
const { ERRORS } = require("../errorConstants")
const TEXT = require("../text").TEXT

/**
 * Entry for one like, creates a tweet like entry and likes a tweet
 * @param {Object} req 
 * @param {Object} res 
 */
exports.createLike = async (req, res) => {
    let reqUserId = parseInt(req.params.userid)
    let reqTweetId = parseInt(req.params.tweetid)
    let reqLikeType = req.params.likeType.toString()
    if(!reqUserId || !reqTweetId || !reqLikeType){
        return res.send(utils.sendResponse(false, "", TEXT.someFieldsMissing))
    }
    let createData = {
        user_id : reqUserId,
        entity_type : TEXT.entityTweet,
        entity_id : reqTweetId,
        like_type : reqLikeType
    }
    let whereData = {
        user_id : reqUserId,
        entity_type : TEXT.entityTweet,
        entity_id : reqTweetId
    }
    const isalreadyLiked = await tweetLikesClass.readLike(whereData)
    if(isalreadyLiked.success == false){
        const tweetLikes = await tweetLikesClass.createLike(createData)
        res.send(utils.sendResponse(true, tweetLikes.data, ""))
    }
    res.send(utils.sendResponse(false, "", ""))
}

/**
 * Read tweetLikes and checks if user liked tweet or not
 * @param {Object} req 
 * @param {Object} res 
 */
exports.readLike = async (req, res) => {
    let reqUserId = parseInt(req.params.userid)
    let reqTweetId = parseInt(req.params.tweetid)
    if(!reqUserId || !reqTweetId){
        return res.send(utils.sendResponse(false, "", TEXT.someFieldsMissing))
    }
    let whereData = {
        user_id : reqUserId,
        entity_type : TEXT.entityTweet,
        entity_id :reqTweetId
    }
    const readTweet = await tweetLikesClass.readLike(whereData)
    if(readTweet.success == false){
        res.send(utils.sendResponse(false, "", ERRORS.noLikeByUser))
    }
    res.send(utils.sendResponse(true, readTweet.data, ""))
}

/**
 * Dislike tweet or delete tweet likes from table entry
 * @param {Object} req 
 * @param {Object} res 
 */
exports.deleteLike = async (req, res) => {
    let reqUserId = parseInt(req.params.userid)
    let reqTweetId = parseInt(req.params.tweetid)
    if(!reqUserId || !reqTweetId){
        return res.send(utils.sendResponse(false, "", TEXT.someFieldsMissing))
    }
    let whereData = {
        user_id : reqUserId,
        entity_type : TEXT.entityTweet,
        entity_id : reqTweetId
    }
    const deleteLike = await tweetLikesClass.deleteLike(whereData)
    res.send(utils.sendResponse(true, deleteLike.data, ""))
}

/**
 * All users who liked this tweet
 * @param {Object} req 
 * @param {Object} res 
 */
exports.whoAllLikedTweet = async (req, res) => {
    let reqTweetId = parseInt(req.params.tweetid)
    if(!reqTweetId){
        return res.send(utils.sendResponse(false, "", TEXT.someFieldsMissing))
    }
    let whereData = {
        entity_type : TEXT.entityTweet,
        entity_id : reqTweetId
    }
    let includeData = [
        {
            model : userdb, as : "user",
            attributes:['id', 'name']
        }
    ]
    const whoAllLikedTweet = await tweetLikesClass.whoAllLikedTweet(whereData, includeData)
    res.send(utils.sendResponse(true, whoAllLikedTweet.data, ""))
}