const likes = require("../../model/Likes")
const utils = require("../../utils")
const { ERRORS } = require("../../errorConstants")

/**
 * Insert data of user who liked the comment
 * @param {Object} createData 
 */
exports.createLike = async (createData) => {
    const createLike = await likes.create(createData)
    return utils.classResponse(true, createLike, "")
}

/**
 * Reads and checks if user liked this comment or not
 * @param {Object} whereData 
 */
exports.readLike = async (whereData) => {
    const readLike = await likes.findAll({
        where: whereData
    })
    if (readLike.length == 0) {
        return utils.classResponse(false, "", ERRORS.noLikeByUser)
    }
    return utils.classResponse(true, readLike, "")
}

/**
 * Dislike comment or deletes entry from commentLikes table when user dislike the comment
 * @param {Object} whereData 
 */
exports.deleteLike = async (whereData) => {
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
exports.whoAllLikedcomment = async (whereData, includeData) => {
    const usersList = await likes.findAll({
        where: whereData,
        include: includeData
    })
    return utils.classResponse(true, usersList, "")
}

/**
 * Checks if tweet was liked by signed in user or not
 * @param {*Object} whereData 
 */
exports.isCommentLikedByMe = async (whereData) => {
    const isCommentLikedByMe = await likes.findOne({
        where: whereData
    })
    if (isCommentLikedByMe == null) {
        return utils.classResponse(false, "", "")
    }
    return utils.classResponse(true, isCommentLikedByMe, "")
}