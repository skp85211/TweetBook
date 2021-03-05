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
    let reqUserId = parseInt(req.body.userid)
    let reqTweetId = parseInt(req.params.tweetid)
    let reqLikeType = req.params.likeType.toString()
    if(!reqUserId || !reqTweetId || !reqLikeType){
        return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
    }
    const isalreadyLiked = await tweetLikesClass.readLike(reqUserId, reqTweetId)
    if(isalreadyLiked.success == false){
        const tweetLikes = await tweetLikesClass.createLike(reqUserId, reqTweetId, reqLikeType)
        return utils.sendResponse(res, true, tweetLikes.data, "")
    }
    return utils.sendResponse(res, false, {}, "")
}

/**
 * Read tweetLikes and checks if user liked tweet or not
 * @param {Object} req 
 * @param {Object} res 
 */
exports.readLike = async (req, res) => {
    let reqUserId = parseInt(req.body.userid)
    let reqTweetId = parseInt(req.params.tweetid)
    if(!reqUserId || !reqTweetId){
        return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
    }
    const readTweet = await tweetLikesClass.readLike(reqUserId, reqTweetId)
    if(readTweet.success == false){
        return utils.sendResponse(res, false, {}, ERRORS.noLikeByUser)
    }
    return utils.sendResponse(res, true, readTweet.data, "")
}

/**
 * Dislike tweet or delete tweet likes from table entry
 * @param {Object} req 
 * @param {Object} res 
 */
exports.deleteLike = async (req, res) => {
    let reqUserId = parseInt(req.body.userid)
    let reqTweetId = parseInt(req.params.tweetid)
    if(!reqUserId || !reqTweetId){
        return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
    }
    const deleteLike = await tweetLikesClass.deleteLike(reqUserId, reqTweetId)
    return utils.sendResponse(res, true, deleteLike.data, "")
}

/**
 * All users who liked this tweet
 * @param {Object} req 
 * @param {Object} res 
 */
exports.whoAllLikedTweet = async (req, res) => {
    let reqTweetId = parseInt(req.params.tweetid)
    if(!reqTweetId){
        return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
    }
    const whoAllLikedTweet = await tweetLikesClass.whoAllLikedTweet(reqTweetId)
    return utils.sendResponse(res, true, whoAllLikedTweet.data, "")
}