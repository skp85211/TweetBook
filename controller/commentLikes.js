const CommentLikes = require("../classes/CommentLikes/CommentLikes")

const utils = require("../utils")
const ERRORS = require("../errorConstants").ERRORS

/**
 * Entry for one like, creates a comment like entry and likes a comment
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 * @returns 
 */
exports.createLike = async (req, res, next) => {
    let reqUserId = parseInt(req.userid)
    let reqcommentId = parseInt(req.body.commentid)
    let reqLikeType = (req.body.likeType || "").toString()
    if(!reqUserId || isNaN(reqUserId) || !reqcommentId || isNaN(reqcommentId) || !reqLikeType){
        return utils.sendResponse(res, false, {}, ERRORS.someFieldsMissing)
    }
    let isalreadyLiked = await CommentLikes.readLike(reqUserId, reqcommentId)
    if(isalreadyLiked.success == false){
        let commentLikes = await CommentLikes.createLike(reqUserId, reqcommentId, reqLikeType)
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
    let reqUserId = parseInt(req.userid)
    let reqcommentId = parseInt(req.headers.commentid)
    if(!reqUserId || isNaN(reqUserId) || !reqcommentId || isNaN(reqcommentId)){
        return utils.sendResponse(res, false, {}, ERRORS.someFieldsMissing)
    }
    let readcomment = await CommentLikes.readLike(reqUserId, reqcommentId)
    if(readcomment.success == false){
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
    let reqUserId = parseInt(req.userid)
    let reqcommentId = parseInt(req.body.commentid)
    if(!reqUserId || isNaN(reqUserId) || !reqcommentId || isNaN(reqcommentId)){
        return utils.sendResponse(res, false, {}, ERRORS.someFieldsMissing)
    }
    let deleteLike = await CommentLikes.deleteLike(reqUserId, reqcommentId)
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
    let reqcommentId = parseInt(req.headers.commentid)
    if(!reqcommentId || isNaN(reqcommentId)){
        return utils.sendResponse(res, false, {}, ERRORS.someFieldsMissing)
    }
    let whoAllLikedcomment = await CommentLikes.whoAllLikedcomment(reqcommentId)
    return utils.sendResponse(res, true, whoAllLikedcomment.data, "")
}