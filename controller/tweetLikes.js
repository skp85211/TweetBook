const TweetLikes = require("../classes/TweetLikes/TweetLikes")

const utils = require("../utils")
const ERRORS  = require("../errorConstants").ERRORS
const TEXT = require("../text").TEXT

/**
 * Entry for one like, creates a tweet like entry and likes a tweet
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 */
exports.createLike = async (req, res, next) => {
    let reqUserId = parseInt(req.userid)
    let reqTweetId = parseInt(req.params.tweetid)
    let reqLikeType = (req.params.likeType || "").toString()
    if(!reqUserId || isNaN(reqUserId) || !reqTweetId || isNaN(reqTweetId) || !reqLikeType){
        return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
    }
    let isalreadyLiked = await TweetLikes.readLike(reqUserId, reqTweetId)
    if(isalreadyLiked.success == false){
        let tweetLikes = await TweetLikes.createLike(reqUserId, reqTweetId, reqLikeType)
        return utils.sendResponse(res, true, tweetLikes.data, "")
    }
    return utils.sendResponse(res, false, {}, "")
}

/**
 * Read tweetLikes and checks if user liked tweet or not
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 */
exports.readLike = async (req, res, next) => {
    let reqUserId = parseInt(req.userid)
    let reqTweetId = parseInt(req.params.tweetid)
    if(!reqUserId || isNaN(reqUserId) || !reqTweetId || isNaN(reqTweetId)){
        return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
    }
    let readTweet = await TweetLikes.readLike(reqUserId, reqTweetId)
    if(readTweet.success == false){
        return utils.sendResponse(res, false, {}, ERRORS.noLikeByUser)
    }
    return utils.sendResponse(res, true, readTweet.data, "")
}

/**
 * Dislike tweet or delete tweet likes from table entry
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 */
exports.deleteLike = async (req, res, next) => {
    let reqUserId = parseInt(req.userid)
    let reqTweetId = parseInt(req.params.tweetid)
    if(!reqUserId || isNaN(reqUserId) || !reqTweetId || isNaN(reqTweetId)){
        return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
    }
    let deleteLike = await TweetLikes.deleteLike(reqUserId, reqTweetId)
    return utils.sendResponse(res, true, deleteLike.data, "")
}

/**
 * All users who liked this tweet
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 */
exports.whoAllLikedTweet = async (req, res, next) => {
    let reqTweetId = parseInt(req.params.tweetid)
    if(!reqTweetId || isNaN(reqTweetId)){
        return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
    }
    let whoAllLikedTweet = await TweetLikes.whoAllLikedTweet(reqTweetId)
    return utils.sendResponse(res, true, whoAllLikedTweet.data, "")
}