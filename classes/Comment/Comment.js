const commentdb = require("../../model/Comments")
const tweetdb = require("../../model/Tweets")
const userdb = require("../../model/User")
const likes = require("../../model/Likes")
const constant = require("./constant")
const utils = require("../../utils")

/**
 * checks if tweet id exists or not in tweet database
 * @param {array} attr 
 * @param {object} whereData 
 */
exports.checkTweetIdExists = async (reqTweetid) => {
    let whereData = { 
        id : reqTweetid
    }
    let attr = ['id']
    const tidCheck = await tweetdb.findAll({
        attributes: attr,
        where: whereData
    })
    return utils.classResponse(true, tidCheck, "")
}

/**
 * Checks if user id exist or not
 * @param {array} attr 
 * @param {object} whereData 
 */
exports.checkUserIdExists = async (reqUserid) => {
    let attribute = ['id']
        let whereData = {
            id:reqUserid
        }
    const uidCheck = await userdb.findAll({
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
exports.createComment = async (tid, uid, comment) => {
    const newComment = await commentdb.create({
        tid: tid,
        uid: uid,
        comment: comment,
    })
    return utils.classResponse(true, newComment, "")
}


/**
 * Gets all comments from database
 * @param {object} whereData 
 * @param {array} orderData 
 */
exports.readComment = async (reqTweetid) => {
    let whereData = {
        tid : reqTweetid
    }
    let orderData = ['createdAt', 'DESC']
    const comments = await commentdb.findAll({
        where: whereData,
        order: [
            orderData
        ]
    })
    return utils.classResponse(true, comments, "")
}


/**
 * update comment
 * @param {object} updateData 
 * @param {object} whereData 
 */
exports.updateComment = async (reqId, reqTweetid, reqUserid, reqComment) => {
    let updateData = {comment : reqComment}
    let whereData = {
        [Op.and] : [
            {id:reqId},
            {tid:reqTweetid},
            {uid: reqUserid}
        ]
    }
    const updateComment = await commentdb.update(updateData, {
        where: whereData
    })
    return utils.classResponse(true, updateComment, "")
}


/**
 * Delete comments from database
 * @param {object} whereData 
 */
exports.deleteComment = async (reqId, reqTweetid, reqUserid) => {
    let whereData = {
        id: reqId,
        tid:reqTweetid,
        uid: reqUserid
    }
    const deleteComment = await commentdb.destroy({
        where: whereData
    })
    return utils.classResponse(true, deleteComment, "")
}

/**
 * gets all comments under all tweets
 */
exports.allInComment = async () => {
    const allComments = await tweetdb.findAll({
        include: ["comments"]
    })
    return utils.classResponse(true, allComments, "")
}


/**
 * All comments under specific tweet with pagination
 * @param {object} whereData 
 * @param {object} includeData 
 * @param {array} orderData 
 * @param {Integer} oset 
 */
exports.commentsUnderTweetsdb = async (reqTweetid, oset) => {
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
    const { count, rows } = await commentdb.findAndCountAll({
        where: whereData,
        include: includeData,
        order: orderData,
        offset: oset,
        limit: constant.limitComment
    })
    return utils.classResponse(true, rows, "")
}
