const { Op } = require('sequelize')
const userdb = require("../model/User")
const utils = require("../utils")
const TEXT = require("../text").TEXT
const CommentClass = require("../classes/Comment/Comment");
const { emptyFieldCreateComment } = require('../classes/Comment/Function');
const likes = require('../model/Likes')
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
        return res.send(utils.sendResponse(false, "", errors.join(",")))
    }
    //tweet id verification
    try {
        let whereData = { id : reqTweetid}
        let attr = ['id']
        const tidCheckResponse = await CommentClass.checkTweetIdExists(attr, whereData)
        const tidCheck = tidCheckResponse.data
        if(tidCheck.length == 0){
            res.send(utils.sendResponse(false, "", TEXT.noTweetExist))
    }
    } catch (error) {
        res.send(utils.sendResponse(false, "", error))
    }
    //user id verification
    try {
        let attr = ['id']
        let whereData = {id : reqUserid}
        const uidCheckResponse = await CommentClass.checkUserIdExists(attr, whereData)
        const uidCheck = uidCheckResponse.data
        if(uidCheck.length == 0){
            res.send(utils.sendResponse(false, "", TEXT.noUserExists))
    }
    } catch (error) {
        res.send(utils.sendResponse(false, "", error))
    }
    
    try {
        const newCommentResponse = await CommentClass.createComment(req.body.tid, req.body.userid, req.body.comment)
        const newComment = newCommentResponse.data
        res.send(utils.sendResponse(true, newComment, ""))
    } catch (error) {
        res.send(utils.sendResponse(false, "", error))
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
            return res.send(utils.sendResponse(false, "", TEXT.noTweetId))
        }
        let whereData = {tid : reqTweetid}
        let orderData = ['createdAt', 'DESC']
        const commentsResponse = await CommentClass.readComment(whereData, orderData)
        const comments = commentsResponse.data
        res.send(utils.sendResponse(true, comments, ""))
    } catch (error) {
        res.send(utils.sendResponse(false, "", error))
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
            return res.send(utils.sendResponse(false, "", TEXT.someFieldsMissing))
        }
        let updateData = {comment : reqComment}
        let whereData = {
            [Op.and] : [
                {id:reqId},
                {tid:reqTweetid},
                {uid: reqUserid}
            ]
        }
        const updateCommentResponse = await CommentClass.updateComment(updateData, whereData)
        const updateComment = updateCommentResponse.data
        res.send(utils.sendResponse(true, updateComment, ""))
    } catch (error) {
        res.send(utils.sendResponse(false, "", error))
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
            return res.send(utils.sendResponse(false, "", TEXT.someFieldsMissing))
        }
        let whereData = {
            id: reqId,
            tid:reqTweetid,
            uid: reqUserid
        }
        const deleteCommentResponse = await CommentClass.deleteComment(whereData)
        const deleteComment = deleteCommentResponse.data
        res.send(utils.sendResponse(true, deleteComment, ""))
    } catch (error) {
        res.send(utils.sendResponse(false, "", error))
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
        res.send(utils.sendResponse(true, allComments.data, ""))
    } catch (error) {
        res.send(utils.sendResponse(false, "", error))
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
            return res.send(utils.sendResponse(false, "", TEXT.someFieldsMissing))
        }
        pageno = pageno-1;
        let pageSize = 5;
        let offsetValue = (pageno*pageSize);

        let whereData = {
            tid:reqTweetid
        }
        let includeData = [
            {
                model:userdb, as:"user",
                attributes:['id','name']
            },
            {
                model : likes, as:"likes"
            }
        ]
        let orderData = [
            ['createdAt', 'DESC']
        ]
        const recordRowsResponse = await CommentClass.commentsUnderTweetsdb(whereData, includeData, orderData, offsetValue)
        const recordRows = recordRowsResponse.data
        for(const dataItems of recordRows){
            dataItems["commentLikesCount"] = friendshipClassFunc.countDiffLikes(dataItems.likes)
            if(dataItems.likes.length == 0){
                dataItems["isCommentLikedByMe"] = false
            }
            else{
                let commentid = dataItems.id
                let whereData = {
                    user_id : reqUserid,
                    entity_type : TEXT.entityComment,
                    entity_id : commentid
                }
                const isCommentLikedByMe = await commentLikesClass.isCommentLikedByMe(whereData)
                if(isCommentLikedByMe.success == false){
                    
                    dataItems["isCommentLikedByMe"] = false
                }
                else{
                    dataItems["isCommentLikedByMe"] = true
                    dataItems["likeType"] = isCommentLikedByMe.data.like_type
                }
            }
        }
        res.send(utils.sendResponse(true, recordRows, ""))
    } catch (error) {
        res.send(utils.sendResponse(false, "", error))
    }
}
