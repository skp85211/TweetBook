const Comment = require("../classes/Comment/Comment")
const CommentLikes = require("../classes/CommentLikes/CommentLikes")

const CommentFunc = require('../classes/Comment/Function')
const FriendshipFunc = require("../classes/Friendship/Function")
const Constant = require("../classes/Comment/Constant").Constant
const utils = require("../utils")
const ERRORS = require("../errorConstants").ERRORS

/** 
 * creates new comment 
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 * @returns 
 */
exports.createComment = async(req, res, next) => {
    let reqTweetid = parseInt(req.body.tid)
    let reqUserid = parseInt(req.userid)
    let reqComment = (req.body.comment || "").toString()
    let errors = CommentFunc.emptyFieldCreateComment(reqTweetid, reqUserid, reqComment);
    if (errors.length) {
        return utils.sendResponse(res, false, {}, errors.join(","))
    }
    //tweet id verification
    try {
        let tidCheckResponse = await Comment.checkTweetIdExists(reqTweetid)
        let tidCheck = tidCheckResponse.data
        if(tidCheck.length == 0){
            return utils.sendResponse(res, false, {},ERRORS.noTweetExist)
    }
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
    //user id verification
    try {
        let uidCheckResponse = await Comment.checkUserIdExists(reqUserid)
        if(uidCheckResponse.data.length == 0){
            return utils.sendResponse(res, false, {}, ERRORS.noUserExists)
    }
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
    
    try {
        let newCommentResponse = await Comment.createComment(reqTweetid, reqUserid, reqComment)
        return utils.sendResponse(res, true, newCommentResponse.data, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}

/**
 * Reads (gets) all comment
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 * @returns 
 */
exports.readComment = async(req, res, next) => {
    try {
        let reqTweetid = parseInt(req.headers.tid)
        if(!reqTweetid || isNaN(reqTweetid)){
            return utils.sendResponse(res, false, {}, ERRORS.noTweetId)
        }
        let commentsResponse = await Comment.readComment(reqTweetid)
        return utils.sendResponse(res, true, commentsResponse.data, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}

/**
 * Update Comment 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 * @returns 
 */
exports.updateComment = async(req, res, next) => {
    try {
        let reqId = parseInt(req.body.id)
        let reqTweetid = parseInt(req.body.tid)
        let reqUserid = parseInt(req.userid)
        let reqComment = (req.body.comment || "").toString()
        if(!reqId || isNaN(reqId) || !reqTweetid || isNaN(reqTweetid) || !reqUserid || isNaN(reqUserid) || !reqComment){
            return utils.sendResponse(res, false, {}, ERRORS.someFieldsMissing)
        }
        let updateCommentResponse = await Comment.updateComment(reqId, reqTweetid, reqUserid, reqComment)
        return utils.sendResponse(res, true, updateCommentResponse.data, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}

/**
 * Delete comment
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 * @returns 
 */
exports.deleteComment = async(req, res, next) => {
    try {
        let reqId = parseInt(req.body.id)
        let reqTweetid = parseInt(req.body.tid)
        let reqUserid = parseInt(req.userid)
        if(!reqId || isNaN(reqId) || !reqTweetid || isNaN(reqTweetid) || !reqUserid || isNaN(reqUserid)){
            return utils.sendResponse(res, false, {}, ERRORS.someFieldsMissing)
        }
        let deleteCommentResponse = await Comment.deleteComment(reqId, reqTweetid, reqUserid)
        return utils.sendResponse(res, true, deleteCommentResponse.data, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}

/**
 * Gets all comment under all tweets
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 * @returns 
 */
//All in tweets
exports.allInComments = async(req, res, next) => {
    try {
        let allComments = await Comment.allInComment()
        return utils.sendResponse(res, true, allComments.data, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}


/**
 * Comments under specific tweet with pagination 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 * @returns 
 */
exports.commentsUnderTweets = async(req, res, next) => {
    try {
        let pageno = parseInt(req.headers.pageno)
        if(!pageno || isNaN(pageno)){
            pageno = Constant.defaultPageNo
        }
        let reqTweetid = parseInt(req.headers.tweetid)
        let reqUserid = parseInt(req.userid)
        if(!reqTweetid || isNaN(reqTweetid) || !reqUserid || isNaN(reqUserid)){
            return utils.sendResponse(res, false, {}, ERRORS.someFieldsMissing)
        }
        pageno = pageno-1;
        let pageSize = Constant.defaultPageSize;
        let offsetValue = (pageno*pageSize);

        let recordRowsResponse = await Comment.commentsUnderTweetsdb(reqTweetid, offsetValue)
        let recordRows = recordRowsResponse.data
        for(let dataItems of recordRows){
            dataItems["commentLikesCount"] = FriendshipFunc.countDiffLikes(dataItems.likes)
            if(dataItems.likes.length == 0){
                dataItems["isCommentLikedByMe"] = false
            }
            else{
                let commentid = dataItems.id
                let isCommentLikedByMe = await CommentLikes.isCommentLikedByMe(reqUserid, commentid)
                if(isCommentLikedByMe.success == false){
                    
                    dataItems["isCommentLikedByMe"] = false
                }
                else{
                    dataItems["isCommentLikedByMe"] = true
                    dataItems["likeType"] = isCommentLikedByMe.data.like_type
                }
            }
        }
        return utils.sendResponse(res, true, recordRows, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}
