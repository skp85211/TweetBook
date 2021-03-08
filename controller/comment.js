const utils = require("../utils")

const Comment = require("../classes/Comment/Comment")
const Likes = require("../classes/Likes/Likes")

const CommentFunc = require('../classes/Comment/Function')
const FriendshipFunc = require("../classes/Friendship/Function")
const Constant = require("../classes/Comment/Constant").Constant
const ERRORS = require("../errorConstants").ERRORS

/** 
 * creates new comment 
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 * @returns 
 */
exports.createComment = async(req, res, next) => {
    let body = req.body
    let reqTweetid = parseInt(body.tid)
    let reqUserid = parseInt(req.userid)
    let reqComment = (body.comment || "")
    let errors = CommentFunc.emptyFieldCreateComment(reqTweetid, reqUserid, reqComment);
    if (errors.length) {
        return utils.sendResponse(res, false, {}, errors.join(","))
    }
    //tweet id verification
        let tidCheckResponse = await Comment.checkTweetIdExists(reqTweetid)
        if (tidCheckResponse.success == false) {
            return utils.sendResponse(res, false, {}, ERRORS.dbError)
        }
        let tidCheck = tidCheckResponse.data
        if(tidCheck.length == 0){
            return utils.sendResponse(res, false, {},ERRORS.noTweetExist)
    }
    //user id verification
        let uidCheckResponse = await Comment.checkUserIdExists(reqUserid)
        if (uidCheckResponse.success == false) {
            return utils.sendResponse(res, false, {}, ERRORS.dbError)
        }
        if(uidCheckResponse.data.length == 0){
            return utils.sendResponse(res, false, {}, ERRORS.noUserExists)
    }
        let newCommentResponse = await Comment.createComment(reqTweetid, reqUserid, reqComment)
        if (newCommentResponse.success == false) {
            return utils.sendResponse(res, false, {}, ERRORS.dbError)
        }
        return utils.sendResponse(res, true, newCommentResponse.data, "")
}

/**
 * Reads (gets) all comment
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 * @returns 
 */
exports.readComment = async(req, res, next) => {
        let reqTweetid = parseInt(req.query.tid)
        if(!reqTweetid || isNaN(reqTweetid)){
            return utils.sendResponse(res, false, {}, ERRORS.noTweetId)
        }
        let commentsResponse = await Comment.readComment(reqTweetid)
        if (commentsResponse.success == false) {
            return utils.sendResponse(res, false, {}, ERRORS.dbError)
        }
        return utils.sendResponse(res, true, commentsResponse.data, "")
}

/**
 * Update Comment 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 * @returns 
 */
exports.updateComment = async(req, res, next) => {
        let body = req.body
        let reqId = parseInt(body.id)
        let reqTweetid = parseInt(body.tid)
        let reqUserid = parseInt(req.userid)
        let reqComment = (body.comment || "")
        if(!reqId || isNaN(reqId) || !reqTweetid || isNaN(reqTweetid) || !reqUserid || isNaN(reqUserid) || !reqComment){
            return utils.sendResponse(res, false, {}, ERRORS.someFieldsMissing)
        }
        let updateCommentResponse = await Comment.updateComment(reqId, reqTweetid, reqUserid, reqComment)
        if (updateCommentResponse.success == false) {
            return utils.sendResponse(res, false, {}, ERRORS.dbError)
        }
        return utils.sendResponse(res, true, updateCommentResponse.data, "")
}

/**
 * Delete comment
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 * @returns 
 */
exports.deleteComment = async(req, res, next) => {
        let body = req.body
        let reqId = parseInt(body.id)
        let reqTweetid = parseInt(body.tid)
        let reqUserid = parseInt(req.userid)
        if(!reqId || isNaN(reqId) || !reqTweetid || isNaN(reqTweetid) || !reqUserid || isNaN(reqUserid)){
            return utils.sendResponse(res, false, {}, ERRORS.someFieldsMissing)
        }
        let deleteCommentResponse = await Comment.deleteComment(reqId, reqTweetid, reqUserid)
        if (deleteCommentResponse.success == false) {
            return utils.sendResponse(res, false, {}, ERRORS.dbError)
        }
        return utils.sendResponse(res, true, deleteCommentResponse.data, "")
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
        let allComments = await Comment.allInComment()
        if (allComments.success == false) {
            return utils.sendResponse(res, false, {}, ERRORS.dbError)
        }
        return utils.sendResponse(res, true, allComments.data, "")
}


/**
 * Comments under specific tweet with pagination 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 * @returns 
 */
exports.commentsUnderTweets = async(req, res, next) => {
        let pageno = parseInt(req.query.pageno)
        if(!pageno || isNaN(pageno)){
            pageno = Constant.defaultPageNo
        }
        let reqTweetid = parseInt(req.query.tweetid)
        let reqUserid = parseInt(req.userid)
        if(!reqTweetid || isNaN(reqTweetid) || !reqUserid || isNaN(reqUserid)){
            return utils.sendResponse(res, false, {}, ERRORS.someFieldsMissing)
        }
        pageno = pageno-1;
        let pageSize = Constant.defaultPageSize;
        let offsetValue = (pageno*pageSize);

        let recordRowsResponse = await Comment.commentsUnderTweetsdb(reqTweetid, offsetValue)
        if (recordRowsResponse.success == false) {
            return utils.sendResponse(res, false, {}, ERRORS.dbError)
        }
        let recordRows = recordRowsResponse.data
        for(let dataItems of recordRows){
            dataItems["commentLikesCount"] = FriendshipFunc.countDiffLikes(dataItems.likes)
            if(dataItems.likes.length == 0){
                dataItems["isCommentLikedByMe"] = false
            }
            else{
                let commentid = dataItems.id
                let isCommentLikedByMe = await Likes.isCommentLikedByMe(reqUserid, commentid)
                if (isCommentLikedByMe.success == false) {
                    return utils.sendResponse(res, false, {}, ERRORS.dbError)
                }
                if(isCommentLikedByMe.data == null){
                    dataItems["isCommentLikedByMe"] = false
                }
                else{
                    dataItems["isCommentLikedByMe"] = true
                    dataItems["likeType"] = isCommentLikedByMe.data.like_type
                }
            }
        }
        return utils.sendResponse(res, true, recordRows, "")
}
