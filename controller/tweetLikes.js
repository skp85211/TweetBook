const utils = require("../utils")

const Likes = require("../classes/Likes/Likes")

const ERRORS = require("../errorConstants").ERRORS

/**
 * Entry for one like, creates a tweet like entry and likes a tweet
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 * @returns 
 */
exports.createLike = async (req, res, next) => {
    let body = req.body
    let reqUserId = parseInt(req.userid)
    let reqTweetId = parseInt(body.tweetid)
    let reqLikeType = (body.likeType || "")
    if (!reqUserId || isNaN(reqUserId) || !reqTweetId || isNaN(reqTweetId) || !reqLikeType) {
        return utils.sendResponse(res, false, {}, ERRORS.someFieldsMissing)
    }
    let isalreadyLiked = await Likes.readTweetLike(reqUserId, reqTweetId)
    if (isalreadyLiked.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    if (isalreadyLiked.success == false) {
        let tweetLikes = await Likes.createTweetLike(reqUserId, reqTweetId, reqLikeType)
        if (tweetLikes.success == false) {
            return utils.sendResponse(res, false, {}, ERRORS.dbError)
        }
        return utils.sendResponse(res, true, tweetLikes.data, "")
    }
    return utils.sendResponse(res, false, {}, "")
}

/**
 * Read tweetLikes and checks if user liked tweet or not
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 * @returns 
 */
exports.readLike = async (req, res, next) => {
    let reqUserId = parseInt(req.userid)
    let reqTweetId = parseInt(req.query.tweetid)
    if (!reqUserId || isNaN(reqUserId) || !reqTweetId || isNaN(reqTweetId)) {
        return utils.sendResponse(res, false, {}, ERRORS.someFieldsMissing)
    }
    let readTweet = await Likes.readTweetLike(reqUserId, reqTweetId)
    if (readTweet.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    if (readTweet.data.length == 0) {
        return utils.sendResponse(res, false, {}, ERRORS.noLikeByUser)
    }
    return utils.sendResponse(res, true, readTweet.data, "")
}

/**
 * Dislike tweet or delete tweet likes from table entry
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 * @returns 
 */
exports.deleteLike = async (req, res, next) => {
    let body = req.body
    let reqUserId = parseInt(req.userid)
    let reqTweetId = parseInt(body.tweetid)
    if (!reqUserId || isNaN(reqUserId) || !reqTweetId || isNaN(reqTweetId)) {
        return utils.sendResponse(res, false, {}, ERRORS.someFieldsMissing)
    }
    let deleteLike = await Likes.deleteTweetLike(reqUserId, reqTweetId)
    if (deleteLike.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    return utils.sendResponse(res, true, deleteLike.data, "")
}

/**
 * All users who liked this tweet
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 * @returns 
 */
exports.whoAllLikedTweet = async (req, res, next) => {
    let reqTweetId = parseInt(req.query.tweetid)
    if (!reqTweetId || isNaN(reqTweetId)) {
        return utils.sendResponse(res, false, {}, ERRORS.someFieldsMissing)
    }
    let whoAllLikedTweet = await Likes.whoAllLikedTweet(reqTweetId)
    if (whoAllLikedTweet.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    return utils.sendResponse(res, true, whoAllLikedTweet.data, "")
}