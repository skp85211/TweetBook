const Comment = require("../../model/Comments")
const Tweets = require("../../model/Tweets")
const User = require("../../model/User")
const Likes = require("../../model/Likes")

const Constant = require("./Constant").Constant
const utils = require("../../utils")

const ERRORS = require("../../errorConstants").ERRORS

/**
 * checks if tweet id exists or not in tweet database
 * @param {Integer} reqTweetid 
 * @returns 
 */
const checkTweetIdExists = async (reqTweetid) => {
    try {
        let tidCheck = await Tweets.findAll({
            attributes: ['id'],
            where: { 
                id : reqTweetid
            }
        })
        return utils.classResponse(true, tidCheck, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

/**
 * Checks if user id exist or not
 * @param {Integer} reqUserid 
 * @returns 
 */
const checkUserIdExists = async (reqUserid) => {
    try {
        let uidCheck = await User.findAll({
            attributes: ['id'],
            where: {
                id:reqUserid
            }
        })
        return utils.classResponse(true, uidCheck, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
    
}

/**
 * Insert comments in comment table
 * @param {Integer} tid 
 * @param {Integer} uid 
 * @param {String} comment 
 */
const createComment = async (tid, uid, comment) => {
    try {
        let newComment = await Comment.create({
            tid: tid,
            uid: uid,
            comment: comment,
        })
        return utils.classResponse(true, newComment, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
    
}

/**
 * Gets all comments from database
 * @param {Integer} reqTweetid 
 * @returns 
 */
const readComment = async (reqTweetid) => {
    try {
        let comments = await Comment.findAll({
            where: {
                tid : reqTweetid
            },
            order: [
                ['createdAt', 'DESC']
            ]
        })
        return utils.classResponse(true, comments, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
    
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
    try {
        let updateComment = await Comment.update({comment : reqComment}, {
            where:{
                [Op.and] : [
                    {id:reqId},
                    {tid:reqTweetid},
                    {uid: reqUserid}
                ]
            }
        })
        return utils.classResponse(true, updateComment, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

/**
 * Delete comments from database
 * @param {Integr} reqId 
 * @param {Integer} reqTweetid 
 * @param {Integer} reqUserid 
 * @returns 
 */
const deleteComment = async (reqId, reqTweetid, reqUserid) => {
    try {
        let deleteComment = await Comment.destroy({
            where: {
                id: reqId,
                tid:reqTweetid,
                uid: reqUserid
            }
        })
        return utils.classResponse(true, deleteComment, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

/**
 * gets all comments under all tweets
 * @returns 
 */
const allInComment = async () => {
    try {
        let allComments = await Tweets.findAll({
            include: ["comments"]
        })
        return utils.classResponse(true, allComments, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

/**
 * All comments under specific tweet with pagination
 * @param {Integer} reqTweetid 
 * @param {Integer} oset 
 * @returns 
 */
const commentsUnderTweetsdb = async (reqTweetid, oset) => {
    try {
        let { count, rows } = await Comment.findAndCountAll({
            where: {
                tid:reqTweetid
            },
            include: [
                {
                    model:User, as:"user",
                    attributes:['id','name']
                },
                {
                    model : Likes, as:"likes"
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            offset: oset,
            limit: Constant.limitComment
        })
        return utils.classResponse(true, rows, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

module.exports = { checkTweetIdExists, checkUserIdExists, createComment, readComment, updateComment, deleteComment, allInComment, commentsUnderTweetsdb }