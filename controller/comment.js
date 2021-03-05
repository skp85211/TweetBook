const utils = require("../utils")
const TEXT = require("../text").TEXT
const CommentClass = require("../classes/Comment/Comment");
const { emptyFieldCreateComment } = require('../classes/Comment/Function');
const commentLikesClass = require("../classes/CommentLikes/CommentLikes")
const friendshipClassFunc = require("../classes/Friendship/Function")

/** 
 * creates new comment by calling db call function
 * @param {object} req 
 * @param {object} res 
 */
exports.createComment = async(req, res) => {
    //empty field check
    let reqTweetid = parseInt(req.body.tid)
    let reqUserid = parseInt(req.body.userid)
    let reqComment = req.body.comment.toString()
    let errors = emptyFieldCreateComment(reqTweetid, reqUserid, reqComment);
    if (errors.length) {
        return utils.sendResponse(res, false, {}, errors.join(","))
    }
    //tweet id verification
    try {
        const tidCheckResponse = await CommentClass.checkTweetIdExists(reqTweetid)
        const tidCheck = tidCheckResponse.data
        if(tidCheck.length == 0){
            return utils.sendResponse(res, false, {}, TEXT.noTweetExist)
    }
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
    //user id verification
    try {
        let uidCheckResponse = await CommentClass.checkUserIdExists(reqUserid)
        if(uidCheckResponse.data.length == 0){
            return utils.sendResponse(res, false, {}, TEXT.noUserExists)
    }
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
    
    try {
        const newCommentResponse = await CommentClass.createComment(req.body.tid, req.body.userid, req.body.comment)
        return utils.sendResponse(res, true, newCommentResponse.data, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}


/**
 * Reads all comment
 * @param {Object} req 
 * @param {Object} res 
 */
exports.readComment = async(req, res) => {
    try {
        let reqTweetid = parseInt(req.body.tid)
        if(!reqTweetid){
            return utils.sendResponse(res, false, {}, TEXT.noTweetId)
        }
        const commentsResponse = await CommentClass.readComment(reqTweetid)
        return utils.sendResponse(res, true, commentsResponse.data, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}


/**
 * Update Comment 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.updateComment = async(req, res) => {
    try {
        let reqId = parseInt(req.body.id)
        let reqTweetid = parseInt(req.body.tid)
        let reqUserid = parseInt(req.body.userid)
        let reqComment = req.body.comment.toString()
        if(!reqId || !reqTweetid || !reqUserid || !reqComment){
            return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
        }
        const updateCommentResponse = await CommentClass.updateComment(reqId, reqTweetid, reqUserid, reqComment)
        return utils.sendResponse(res, true, updateCommentResponse.data, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}

/**
 * Delete comment
 * @param {Object} req 
 * @param {Object} res 
 */
exports.deleteComment = async(req, res) => {
    try {
        let reqId = parseInt(req.body.id)
        let reqTweetid = parseInt(req.body.tid)
        let reqUserid = parseInt(req.body.userid)
        if(!reqId || !reqTweetid || !reqUserid){
            return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
        }
        const deleteCommentResponse = await CommentClass.deleteComment(reqId, reqTweetid, reqUserid)
        return utils.sendResponse(res, true, deleteCommentResponse.data, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}


/**
 * Gets all comment under all tweets
 * @param {Object} req 
 * @param {Object} res 
 */
//All in tweets
exports.allInComments = async(req, res) => {
    try {
        const allComments = await CommentClass.allInComment()
        return utils.sendResponse(res, true, allComments.data, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}


/**
 * Comments under specific tweet with pagination 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.commentsUnderTweets = async(req, res) => {
    try {
        let pageno = parseInt(req.params.pageno);
        let reqTweetid = parseInt(req.params.tweetid)
        let reqUserid = parseInt(req.body.userid)
        if(!pageno || !reqTweetid || !reqUserid){
            return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
        }
        pageno = pageno-1;
        let pageSize = 5;
        let offsetValue = (pageno*pageSize);

        const recordRowsResponse = await CommentClass.commentsUnderTweetsdb(reqTweetid, offsetValue)
        const recordRows = recordRowsResponse.data
        for(const dataItems of recordRows){
            dataItems["commentLikesCount"] = friendshipClassFunc.countDiffLikes(dataItems.likes)
            if(dataItems.likes.length == 0){
                dataItems["isCommentLikedByMe"] = false
            }
            else{
                let commentid = dataItems.id
                const isCommentLikedByMe = await commentLikesClass.isCommentLikedByMe(reqUserid, commentid)
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
