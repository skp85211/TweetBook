const likes = require("../../model/Likes")
const userdb = require("../../model/User")
const utils = require("../../utils")
const { ERRORS } = require("../../errorConstants")
const TEXT = require("../../text").TEXT

/**
 * Insert data of user who liked the tweet
 * @param {Object} createData 
 */
exports.createLike = async (reqUserId, reqTweetId, reqLikeType) => {
    let createData = {
        user_id : reqUserId,
        entity_type : TEXT.entityTweet,
        entity_id : reqTweetId,
        like_type : reqLikeType
    }
    const createLike = await likes.create(createData)
    return utils.classResponse(true, createLike, "")
}

/**
 * Reads and checks if user liked this tweet or not
 * @param {Object} whereData 
 */
exports.readLike = async (reqUserId, reqTweetId) => {
    let whereData = {
        user_id : reqUserId,
        entity_type : TEXT.entityTweet,
        entity_id : reqTweetId
    }
    const readLike = await likes.findAll({
        where: whereData
    })
    if (readLike.length == 0) {
        return utils.classResponse(false, {}, ERRORS.noLikeByUser)
    }
    return utils.classResponse(true, readLike, "")
}

/**
 * Dislike tweet or deletes entry from likes table when user dislike the tweet
 * @param {Object} whereData 
 */
exports.deleteLike = async (reqUserId, reqTweetId) => {
    let whereData = {
        user_id : reqUserId,
        entity_type : TEXT.entityTweet,
        entity_id : reqTweetId
    }
    const deleteLike = await likes.destroy({
        where: whereData
    })
    return utils.classResponse(true, deleteLike, "")
}

/**
 * All user who liked this tweet
 * @param {Object} whereData 
 * @param {Array} includeData 
 */
exports.whoAllLikedTweet = async (reqTweetId) => {
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
    const usersList = await likes.findAll({
        where: whereData,
        include: includeData
    })
    return utils.classResponse(true, usersList, "")
}