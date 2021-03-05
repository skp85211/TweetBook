const likes = require("../../model/Likes")
const userdb = require("../../model/User")
const utils = require("../../utils")
const { ERRORS } = require("../../errorConstants")
const TEXT = require("../../text").TEXT

/**
 * Insert data of user who liked the comment
 * @param {Object} createData 
 */
exports.createLike = async (reqUserId, reqcommentId, reqLikeType) => {
    let createData = {
        user_id : reqUserId,
        entity_type : TEXT.entityComment,
        entity_id : reqcommentId,
        like_type : reqLikeType
    }
    const createLike = await likes.create(createData)
    return utils.classResponse(true, createLike, "")
}

/**
 * Reads and checks if user liked this comment or not
 * @param {Object} whereData 
 */
exports.readLike = async (reqUserId, reqcommentId) => {
    let whereData = {
        user_id : reqUserId,
        entity_type : TEXT.entityComment,
        entity_id : reqcommentId
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
 * Dislike comment or deletes entry from likes table when user dislike the comment
 * @param {Object} whereData 
 */
exports.deleteLike = async (reqUserId, reqcommentId) => {
    let whereData = {
        user_id : reqUserId,
        entity_type : TEXT.entityComment,
        entity_id : reqcommentId
    }
    const deleteLike = await likes.destroy({
        where: whereData
    })
    return utils.classResponse(true, deleteLike, "")
}

/**
 * All user who liked this comment
 * @param {Object} whereData 
 * @param {Array} includeData 
 */
exports.whoAllLikedcomment = async (reqcommentId) => {
    let whereData = {
        entity_type : TEXT.entityComment,
        entity_id : reqcommentId
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

/**
 * Checks if comment was liked by signed in user or not
 * @param {*Object} whereData 
 */
exports.isCommentLikedByMe = async (reqUserid, commentid) => {
    let whereData = {
        user_id : reqUserid,
        entity_type : TEXT.entityComment,
        entity_id : commentid
    }
    const isCommentLikedByMe = await likes.findOne({
        where: whereData
    })
    if (isCommentLikedByMe == null) {
        return utils.classResponse(false, "", "")
    }
    return utils.classResponse(true, isCommentLikedByMe, "")
}