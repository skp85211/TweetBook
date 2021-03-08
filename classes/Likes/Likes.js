const utils = require("../../utils")

const Likes = require("../../model/Likes")
const User = require("../../model/User")

const ERRORS = require("../../errorConstants").ERRORS
const TEXT = require("../../text").TEXT

/**
 * Insert data of user who liked the tweet
 * @param {Integer} reqUserId 
 * @param {Integer} reqTweetId 
 * @param {String} reqLikeType 
 * @returns 
 */
const createTweetLike = async (reqUserId, reqTweetId, reqLikeType) => {
    try {
        let createLike = await Likes.create({
            user_id : reqUserId,
            entity_type : TEXT.entityTweet,
            entity_id : reqTweetId,
            like_type : reqLikeType
        })
        return utils.classResponse(true, createLike, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

/**
 * Reads and checks if user liked this tweet or not
 * @param {Integer} reqUserId 
 * @param {Integer} reqTweetId 
 * @returns 
 */
const readTweetLike = async (reqUserId, reqTweetId) => {
    try {
        let readLike = await Likes.findAll({
            where: {
                user_id : reqUserId,
                entity_type : TEXT.entityTweet,
                entity_id : reqTweetId
            }
        })
        return utils.classResponse(true, readLike, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

/**
 * Dislike tweet or deletes entry from Likes table when user dislike the tweet
 * @param {Integer} reqUserId 
 * @param {Integer} reqTweetId 
 * @returns 
 */
const deleteTweetLike = async (reqUserId, reqTweetId) => {
    try {
        let deleteLike = await Likes.destroy({
            where: {
                user_id : reqUserId,
                entity_type : TEXT.entityTweet,
                entity_id : reqTweetId
            }
        })
        return utils.classResponse(true, deleteLike, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
    
}

/**
 * All user who liked this tweet
 * @param {Integer} reqTweetId 
 * @returns 
 */
const whoAllLikedTweet = async (reqTweetId) => {
    try {
        let usersList = await Likes.findAll({
            where: {
                entity_type : TEXT.entityTweet,
                entity_id : reqTweetId
            },
            include: [
                {
                    model : User, as : "user",
                    attributes:['id', 'name']
                }
            ]
        })
        return utils.classResponse(true, usersList, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}


/**
 * Insert data of user who liked the comment
 * @param {Integer} reqUserId 
 * @param {Integer} reqcommentId 
 * @param {String} reqLikeType 
 * @returns 
 */
 const createCommentLike = async (reqUserId, reqcommentId, reqLikeType) => {
    try {
        const createLike = await Likes.create({
            user_id : reqUserId,
            entity_type : TEXT.entityComment,
            entity_id : reqcommentId,
            like_type : reqLikeType
        })
        return utils.classResponse(true, createLike, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
    
}

/**
 * Reads and checks if user liked this comment or not
 * @param {Integer} reqUserId 
 * @param {Integer} reqcommentId 
 * @returns 
 */
const readCommentLike = async (reqUserId, reqcommentId) => {
    try {
        const readLike = await Likes.findAll({
            where: {
                user_id : reqUserId,
                entity_type : TEXT.entityComment,
                entity_id : reqcommentId
            }
        })
        return utils.classResponse(true, readLike, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

/**
 * Dislike comment or deletes entry from Likes table when user dislike the comment
 * @param {Integer} reqUserId 
 * @param {Integer} reqcommentId 
 * @returns 
 */
const deleteCommentLike = async (reqUserId, reqcommentId) => {
    try {
        const deleteLike = await Likes.destroy({
            where: {
                user_id : reqUserId,
                entity_type : TEXT.entityComment,
                entity_id : reqcommentId
            }
        })
        return utils.classResponse(true, deleteLike, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

/**
 * All user who liked this comment
 * @param {Integer} reqcommentId 
 * @returns 
 */
const whoAllLikedcomment = async (reqcommentId) => {
    try {
        const usersList = await Likes.findAll({
            where: {
                entity_type : TEXT.entityComment,
                entity_id : reqcommentId
            },
            include: [
                {
                    model : User, as : "user",
                    attributes:['id', 'name']
                }
            ]
        })
        return utils.classResponse(true, usersList, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

/**
 * Checks if comment was liked by signed in user or not
 * @param {Integer} reqUserid 
 * @param {Integer} commentid 
 * @returns 
 */
const isCommentLikedByMe = async (reqUserid, commentid) => {
    try {
        let isCommentLikedByMe = await Likes.findOne({
            where: {
                user_id : reqUserid,
                entity_type : TEXT.entityComment,
                entity_id : commentid
            }
        })
        return utils.classResponse(true, isCommentLikedByMe, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

module.exports = { createTweetLike, readTweetLike, deleteTweetLike, whoAllLikedTweet, createCommentLike, readCommentLike, deleteCommentLike, whoAllLikedcomment, isCommentLikedByMe }