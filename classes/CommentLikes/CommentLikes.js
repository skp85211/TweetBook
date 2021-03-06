const Likes = require("../../model/Likes")
const User = require("../../model/User")

const utils = require("../../utils")
const ERRORS = require("../../errorConstants").ERRORS
const TEXT = require("../../text").TEXT

/**
 * Insert data of user who liked the comment
 * @param {Integer} reqUserId 
 * @param {Integer} reqcommentId 
 * @param {String} reqLikeType 
 * @returns 
 */
exports.createLike = async (reqUserId, reqcommentId, reqLikeType) => {
    let createData = {
        user_id : reqUserId,
        entity_type : TEXT.entityComment,
        entity_id : reqcommentId,
        like_type : reqLikeType
    }
    const createLike = await Likes.create(createData)
    return utils.classResponse(true, createLike, "")
}

/**
 * Reads and checks if user liked this comment or not
 * @param {Integer} reqUserId 
 * @param {Integer} reqcommentId 
 * @returns 
 */
exports.readLike = async (reqUserId, reqcommentId) => {
    let whereData = {
        user_id : reqUserId,
        entity_type : TEXT.entityComment,
        entity_id : reqcommentId
    }
    const readLike = await Likes.findAll({
        where: whereData
    })
    if (readLike.length == 0) {
        return utils.classResponse(false, {}, ERRORS.noLikeByUser)
    }
    return utils.classResponse(true, readLike, "")
}

/**
 * Dislike comment or deletes entry from Likes table when user dislike the comment
 * @param {Integer} reqUserId 
 * @param {Integer} reqcommentId 
 * @returns 
 */
exports.deleteLike = async (reqUserId, reqcommentId) => {
    let whereData = {
        user_id : reqUserId,
        entity_type : TEXT.entityComment,
        entity_id : reqcommentId
    }
    const deleteLike = await Likes.destroy({
        where: whereData
    })
    return utils.classResponse(true, deleteLike, "")
}

/**
 * All user who liked this comment
 * @param {Integer} reqcommentId 
 * @returns 
 */
exports.whoAllLikedcomment = async (reqcommentId) => {
    let whereData = {
        entity_type : TEXT.entityComment,
        entity_id : reqcommentId
    }
    let includeData = [
        {
            model : User, as : "user",
            attributes:['id', 'name']
        }
    ]
    const usersList = await Likes.findAll({
        where: whereData,
        include: includeData
    })
    return utils.classResponse(true, usersList, "")
}

/**
 * Checks if comment was liked by signed in user or not
 * @param {Integer} reqUserid 
 * @param {Integer} commentid 
 * @returns 
 */
exports.isCommentLikedByMe = async (reqUserid, commentid) => {
    let whereData = {
        user_id : reqUserid,
        entity_type : TEXT.entityComment,
        entity_id : commentid
    }
    let isCommentLikedByMe = await Likes.findOne({
        where: whereData
    })
    if (isCommentLikedByMe == null) {
        return utils.classResponse(false, "", "")
    }
    return utils.classResponse(true, isCommentLikedByMe, "")
}