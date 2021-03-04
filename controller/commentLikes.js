const userdb = require("../model/User")
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
    let reqCommentId = parseInt(req.params.commentid)
    let reqLikeType = req.params.likeType.toString()
    if(!reqUserId || !reqCommentId || !reqLikeType){
        return res.send(utils.sendResponse(false, "", TEXT.someFieldsMissing))
    }
    let createData = {
        user_id : reqUserId,
        entity_type : TEXT.entityComment,
        entity_id : reqCommentId,
        like_type : reqLikeType
    }
    let whereData = {
        user_id : reqUserId,
        entity_type : TEXT.entityComment,
        entity_id : reqCommentId
    }
    const isalreadyLiked = await commentLikesClass.readLike(whereData)
    if(isalreadyLiked.success == false){
        const commentLikes = await commentLikesClass.createLike(createData)
        res.send(utils.sendResponse(true, commentLikes.data, ""))
    }
    res.send(utils.sendResponse(false, "", ERRORS.alreadyLiked))
}

/**
 * Read commentLikes and checks if user liked comment or not
 * @param {Object} req 
 * @param {Object} res 
 */
exports.readLike = async (req, res) => {
    let reqUserId = parseInt(req.body.userid)
    let reqCommentId = parseInt(req.params.commentid)
    if(!reqUserId || !reqCommentId){
        return res.send(utils.sendResponse(false, "", TEXT.someFieldsMissing))
    }
    let whereData = {
        user_id : reqUserId,
        entity_type : TEXT.entityComment,
        entity_id : reqCommentId
    }
    const readcomment = await commentLikesClass.readLike(whereData)
    if(readcomment.success == false){
        res.send(utils.sendResponse(false, "", ERRORS.noLikeByUser))
    }
    res.send(utils.sendResponse(true, readcomment.data, ""))
}

/**
 * Dislike comment or delete comment likes from table entry
 * @param {Object} req 
 * @param {Object} res 
 */
exports.deleteLike = async (req, res) => {
    let reqUserId = parseInt(req.body.userid)
    let reqCommentId = parseInt(req.params.commentid)
    if(!reqUserId || !reqCommentId){
        return res.send(utils.sendResponse(false, "", TEXT.someFieldsMissing))
    }
    let whereData = {
        user_id : reqUserId,
        entity_type : TEXT.entityComment,
        entity_id : reqCommentId
    }
    const deleteLike = await commentLikesClass.deleteLike(whereData)
    res.send(utils.sendResponse(true, deleteLike.data, ""))
}

/**
 * All users who liked this comment
 * @param {Object} req 
 * @param {Object} res 
 */
exports.whoAllLikedcomment = async (req, res) => {
    let reqCommentId = parseInt(req.params.commentid)
    if(!reqCommentId){
        return res.send(utils.sendResponse(false, "", TEXT.someFieldsMissing))
    }
    let whereData = {
        entity_type : TEXT.entityComment,
        entity_id : reqCommentId
    }
    let includeData = [
        {
            model : userdb, as : "user",
            attributes:['id', 'name']
        }
    ]
    const whoAllLikedcomment = await commentLikesClass.whoAllLikedcomment(whereData, includeData)
    res.send(utils.sendResponse(true, whoAllLikedcomment.data, ""))
}