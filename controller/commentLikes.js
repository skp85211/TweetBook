const commentLikesClass = require("../classes/CommentLikes/CommentLikes")
const utils = require("../utils")
const { ERRORS } = require("../errorConstants")
const TEXT = require("../text").TEXT


/**
 * Entry for one like, creates a comment like entry and likes a comment
 * @param {Object} req 
 * @param {Object} res 
 */
exports.createLike = async (req, res) => {
    let reqUserId = parseInt(req.body.userid)
    let reqcommentId = parseInt(req.params.commentid)
    let reqLikeType = req.params.likeType.toString()
    if(!reqUserId || !reqcommentId || !reqLikeType){
        return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
    }
    const isalreadyLiked = await commentLikesClass.readLike(reqUserId, reqcommentId)
    if(isalreadyLiked.success == false){
        const commentLikes = await commentLikesClass.createLike(reqUserId, reqcommentId, reqLikeType)
        return utils.sendResponse(res, true, commentLikes.data, "")
    }
    return utils.sendResponse(res, false, {}, "")
}

/**
 * Read commentLikes and checks if user liked comment or not
 * @param {Object} req 
 * @param {Object} res 
 */
exports.readLike = async (req, res) => {
    let reqUserId = parseInt(req.body.userid)
    let reqcommentId = parseInt(req.params.commentid)
    if(!reqUserId || !reqcommentId){
        return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
    }
    const readcomment = await commentLikesClass.readLike(reqUserId, reqcommentId)
    if(readcomment.success == false){
        return utils.sendResponse(res, false, {}, ERRORS.noLikeByUser)
    }
    return utils.sendResponse(res, true, readcomment.data, "")
}

/**
 * Dislike comment or delete comment likes from table entry
 * @param {Object} req 
 * @param {Object} res 
 */
exports.deleteLike = async (req, res) => {
    let reqUserId = parseInt(req.body.userid)
    let reqcommentId = parseInt(req.params.commentid)
    if(!reqUserId || !reqcommentId){
        return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
    }
    const deleteLike = await commentLikesClass.deleteLike(reqUserId, reqcommentId)
    return utils.sendResponse(res, true, deleteLike.data, "")
}

/**
 * All users who liked this comment
 * @param {Object} req 
 * @param {Object} res 
 */
exports.whoAllLikedcomment = async (req, res) => {
    let reqcommentId = parseInt(req.params.commentid)
    if(!reqcommentId){
        return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
    }
    const whoAllLikedcomment = await commentLikesClass.whoAllLikedcomment(reqcommentId)
    return utils.sendResponse(res, true, whoAllLikedcomment.data, "")
}