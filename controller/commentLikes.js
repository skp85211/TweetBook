const CommentLikes = require("../classes/CommentLikes/CommentLikes")

const utils = require("../utils")
const ERRORS = require("../errorConstants").ERRORS
const TEXT = require("../text").TEXT


/**
 * Entry for one like, creates a comment like entry and likes a comment
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 */
exports.createLike = async (req, res, next) => {
    let reqUserId = parseInt(req.userid)
    let reqcommentId = parseInt(req.params.commentid)
    let reqLikeType = (req.params.likeType || "").toString()
    if(!reqUserId || !reqcommentId || !reqLikeType){
        return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
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
 */
exports.readLike = async (req, res, next) => {
    let reqUserId = parseInt(req.userid)
    let reqcommentId = parseInt(req.params.commentid)
    if(!reqUserId || !reqcommentId){
        return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
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
 */
exports.deleteLike = async (req, res, next) => {
    let reqUserId = parseInt(req.userid)
    let reqcommentId = parseInt(req.params.commentid)
    if(!reqUserId || !reqcommentId){
        return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
    }
    let deleteLike = await CommentLikes.deleteLike(reqUserId, reqcommentId)
    return utils.sendResponse(res, true, deleteLike.data, "")
}

/**
 * All users who liked this comment
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 */
exports.whoAllLikedcomment = async (req, res, next) => {
    let reqcommentId = parseInt(req.params.commentid)
    if(!reqcommentId){
        return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
    }
    let whoAllLikedcomment = await CommentLikes.whoAllLikedcomment(reqcommentId)
    return utils.sendResponse(res, true, whoAllLikedcomment.data, "")
}