const commentdb = require("../../model/Comments")
const tweetdb = require("../../model/Tweets")
const userdb = require("../../model/User")
const constant = require("./constant")
const utils = require("../../utils")

/**
 * checks if tweet id exists or not in tweet database
 * @param {array} attr 
 * @param {object} whereData 
 */
exports.checkTweetIdExists = async (attr, whereData) => {
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
exports.checkUserIdExists = async (attr, whereData) => {
    const uidCheck = await userdb.findAll({
        attributes: attr,
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
exports.readComment = async (whereData, orderData) => {
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
exports.updateComment = async (updateData, whereData) => {
    const updateComment = await commentdb.update(updateData, {
        where: whereData
    })
    return utils.classResponse(true, updateComment, "")
}


/**
 * Delete comments from database
 * @param {object} whereData 
 */
exports.deleteComment = async (whereData) => {
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
exports.commentsUnderTweetsdb = async (whereData, includeData, orderData, oset) => {
    const { count, rows } = await commentdb.findAndCountAll({
        where: whereData,
        include: includeData,
        order: orderData,
        offset: oset,
        limit: constant.limitComment
    })
    return utils.classResponse(true, rows, "")
}
