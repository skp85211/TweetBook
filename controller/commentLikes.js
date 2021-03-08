const utils = require("../utils")

const Likes = require("../classes/Likes/Likes")

const ERRORS = require("../errorConstants").ERRORS

/**
 * Entry for one like, creates a comment like entry and likes a comment
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 * @returns 
 */
exports.createLike = async (req, res, next) => {
    let body = req.body
    let reqUserId = parseInt(req.userid)
    let reqcommentId = parseInt(body.commentid)
    let reqLikeType = (body.likeType || "")
    if (!reqUserId || isNaN(reqUserId) || !reqcommentId || isNaN(reqcommentId) || !reqLikeType) {
        return utils.sendResponse(res, false, {}, ERRORS.someFieldsMissing)
    }
    let isalreadyLiked = await Likes.readCommentLike(reqUserId, reqcommentId)
    if (isalreadyLiked.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    if (isalreadyLiked.success == false) {
        let commentLikes = await Likes.createCommentLike(reqUserId, reqcommentId, reqLikeType)
        if (commentLikes.success == false) {
            return utils.sendResponse(res, false, {}, ERRORS.dbError)
        }
        return utils.sendResponse(res, true, commentLikes.data, "")
    }
    return utils.sendResponse(res, false, {}, "")
}

/**
 * Read commentLikes and checks if user liked comment or not
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 * @returns 
 */
exports.readLike = async (req, res, next) => {
    console.log("log")
    let reqUserId = parseInt(req.userid)
    let reqcommentId = parseInt(req.query.commentid)
    console.log(reqUserId)
    console.log(reqcommentId)
    if (!reqUserId || isNaN(reqUserId) || !reqcommentId || isNaN(reqcommentId)) {
        return utils.sendResponse(res, false, {}, ERRORS.someFieldsMissing)
    }
    let readcomment = await Likes.readCommentLike(reqUserId, reqcommentId)
    if (readcomment.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    if (readcomment.data.length == 0) {
        return utils.sendResponse(res, false, {}, ERRORS.noLikeByUser)
    }
    return utils.sendResponse(res, true, readcomment.data, "")
}

/**
 * Dislike comment or delete comment likes from table entry
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 * @returns 
 */
exports.deleteLike = async (req, res, next) => {
    let body = req.body
    let reqUserId = parseInt(req.userid)
    let reqcommentId = parseInt(body.commentid)
    if (!reqUserId || isNaN(reqUserId) || !reqcommentId || isNaN(reqcommentId)) {
        return utils.sendResponse(res, false, {}, ERRORS.someFieldsMissing)
    }
    let deleteLike = await Likes.deleteCommentLike(reqUserId, reqcommentId)
    if (deleteLike.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    return utils.sendResponse(res, true, deleteLike.data, "")
}

/**
 * All users who liked this comment
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 * @returns 
 */
exports.whoAllLikedcomment = async (req, res, next) => {
    let reqcommentId = parseInt(req.query.commentid)
    if (!reqcommentId || isNaN(reqcommentId)) {
        return utils.sendResponse(res, false, {}, ERRORS.someFieldsMissing)
    }
    let whoAllLikedcomment = await Likes.whoAllLikedcomment(reqcommentId)
    if (whoAllLikedcomment.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    return utils.sendResponse(res, true, whoAllLikedcomment.data, "")
}