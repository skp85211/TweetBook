const Comment = require("../../model/Comments")
const Tweets = require("../../model/Tweets")
const User = require("../../model/User")
const Likes = require("../../model/Likes")

const Constant = require("./Constant").Constant
const utils = require("../../utils")

/**
 * checks if tweet id exists or not in tweet database
 * @param {Integer} reqTweetid 
 * @returns 
 */
const checkTweetIdExists = async (reqTweetid) => {
    let whereData = { 
        id : reqTweetid
    }
    let attr = ['id']
    let tidCheck = await Tweets.findAll({
        attributes: attr,
        where: whereData
    })
    return utils.classResponse(true, tidCheck, "")
}

/**
 * Checks if user id exist or not
 * @param {Integer} reqUserid 
 * @returns 
 */
const checkUserIdExists = async (reqUserid) => {
    let attribute = ['id']
        let whereData = {
            id:reqUserid
        }
    let uidCheck = await User.findAll({
        attributes: attribute,
        where: whereData
    })
    return utils.classResponse(true, uidCheck, "")
}

/**
 * Insert comments in comment table
 * @param {Integer} tid 
 * @param {Integer} uid 
 * @param {String} comment 
 */
const createComment = async (tid, uid, comment) => {
    let newComment = await Comment.create({
        tid: tid,
        uid: uid,
        comment: comment,
    })
    return utils.classResponse(true, newComment, "")
}

/**
 * Gets all comments from database
 * @param {Integer} reqTweetid 
 * @returns 
 */
const readComment = async (reqTweetid) => {
    let whereData = {
        tid : reqTweetid
    }
    let orderData = ['createdAt', 'DESC']
    let comments = await Comment.findAll({
        where: whereData,
        order: [
            orderData
        ]
    })
    return utils.classResponse(true, comments, "")
}

/**
 * 
 * @param {Integer} reqId 
 * @param {Integr} reqTweetid 
 * @param {Integer} reqUserid 
 * @param {String} reqComment 
 * @returns 
 */
const updateComment = async (reqId, reqTweetid, reqUserid, reqComment) => {
    let updateData = {comment : reqComment}
    let whereData = {
        [Op.and] : [
            {id:reqId},
            {tid:reqTweetid},
            {uid: reqUserid}
        ]
    }
    let updateComment = await Comment.update(updateData, {
        where: whereData
    })
    return utils.classResponse(true, updateComment, "")
}

/**
 * Delete comments from database
 * @param {Integr} reqId 
 * @param {Integer} reqTweetid 
 * @param {Integer} reqUserid 
 * @returns 
 */
const deleteComment = async (reqId, reqTweetid, reqUserid) => {
    let whereData = {
        id: reqId,
        tid:reqTweetid,
        uid: reqUserid
    }
    let deleteComment = await Comment.destroy({
        where: whereData
    })
    return utils.classResponse(true, deleteComment, "")
}

/**
 * gets all comments under all tweets
 * @returns 
 */
const allInComment = async () => {
    let allComments = await Tweets.findAll({
        include: ["comments"]
    })
    return utils.classResponse(true, allComments, "")
}

/**
 * All comments under specific tweet with pagination
 * @param {Integer} reqTweetid 
 * @param {Integer} oset 
 * @returns 
 */
const commentsUnderTweetsdb = async (reqTweetid, oset) => {
    let whereData = {
        tid:reqTweetid
    }
    let includeData = [
        {
            model:User, as:"user",
            attributes:['id','name']
        },
        {
            model : Likes, as:"likes"
        }
    ]
    let orderData = [
        ['createdAt', 'DESC']
    ]
    let { count, rows } = await Comment.findAndCountAll({
        where: whereData,
        include: includeData,
        order: orderData,
        offset: oset,
        limit: Constant.limitComment
    })
    return utils.classResponse(true, rows, "")
}

module.exports = { checkTweetIdExists, checkUserIdExists, createComment, readComment, updateComment, deleteComment, allInComment, commentsUnderTweetsdb }