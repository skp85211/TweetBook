const Likes = require("../../model/Likes")
const User = require("../../model/User")

const utils = require("../../utils")
const ERRORS = require("../../errorConstants").ERRORS
const TEXT = require("../../text").TEXT


/**
 * Insert data of user who liked the tweet
 * @param {Integer} reqUserId 
 * @param {Integer} reqTweetId 
 * @param {String} reqLikeType 
 * @returns 
 */
exports.createLike = async (reqUserId, reqTweetId, reqLikeType) => {
    let createData = {
        user_id : reqUserId,
        entity_type : TEXT.entityTweet,
        entity_id : reqTweetId,
        like_type : reqLikeType
    }
    let createLike = await Likes.create(createData)
    return utils.classResponse(true, createLike, "")
}


/**
 * Reads and checks if user liked this tweet or not
 * @param {Integer} reqUserId 
 * @param {Integer} reqTweetId 
 * @returns 
 */
exports.readLike = async (reqUserId, reqTweetId) => {
    let whereData = {
        user_id : reqUserId,
        entity_type : TEXT.entityTweet,
        entity_id : reqTweetId
    }
    let readLike = await Likes.findAll({
        where: whereData
    })
    if (readLike.length == 0) {
        return utils.classResponse(false, {}, ERRORS.noLikeByUser)
    }
    return utils.classResponse(true, readLike, "")
}


/**
 * Dislike tweet or deletes entry from Likes table when user dislike the tweet
 * @param {Integer} reqUserId 
 * @param {Integer} reqTweetId 
 * @returns 
 */
exports.deleteLike = async (reqUserId, reqTweetId) => {
    let whereData = {
        user_id : reqUserId,
        entity_type : TEXT.entityTweet,
        entity_id : reqTweetId
    }
    let deleteLike = await Likes.destroy({
        where: whereData
    })
    return utils.classResponse(true, deleteLike, "")
}


/**
 * All user who liked this tweet
 * @param {Integer} reqTweetId 
 * @returns 
 */
exports.whoAllLikedTweet = async (reqTweetId) => {
    let whereData = {
        entity_type : TEXT.entityTweet,
        entity_id : reqTweetId
    }
    let includeData = [
        {
            model : User, as : "user",
            attributes:['id', 'name']
        }
    ]
    let usersList = await Likes.findAll({
        where: whereData,
        include: includeData
    })
    return utils.classResponse(true, usersList, "")
}