const tweetdb = require("../../model/Tweets")
const friendshipdb = require("../../model/Friendship")
const constant = require("./constant")
const utils = require("../../utils")
const likes = require("../../model/Likes")

/**
 * check if users are already in any relation (checks relation status)
 * @param {object} whereData 
 */
exports.friendshipCheck = async (whereData) => {
    const userPair = await friendshipdb.findAll({
        where: whereData
    })
    return utils.classResponse(true, userPair, "")
}

/**
 * Sends friend request to other user, changes status to pending and actionid 
 * @param {object} whereDataCreate 
 */
exports.friendshipRequestSend = async (whereDataCreate) => {
    const friendRequest = await friendshipdb.create(whereDataCreate)
    // return friendRequest
    return utils.classResponse(true, friendRequest, "")
}

/**
 * friend Request Accept/Reject , changing status -> Accepted(1) or Rejected(2)=>Blocked, action_id
 * @param {object} updateData 
 * @param {object} whereData 
 */
exports.friendRequestUpdate = async (updateData, whereData) => {
    const friendshipUpdate = await friendshipdb.update(updateData, {
        where: whereData
    })
    return utils.classResponse(true, friendshipUpdate, "")
}

/**
 * List all friends of particular user
 * @param {Object} whereData 
 */
exports.friendsList = async (whereData) => {
    const friendList = await friendshipdb.findAll({
        where: whereData
    })
    return utils.classResponse(true, friendList, "")
}

/**
 * Find tweets of all user id who are user's friends
 * @param {object} whereDataFriends 
 * @param {Array} includeDataFriends 
 * @param {Array} orderDataFriends 
 */
exports.friendsTweets = async (whereDataFriends, includeDataFriends, orderDataFriends, oset) => {
    const friendTweets = await tweetdb.findAll({
        where: whereDataFriends,
        include: includeDataFriends,
        order: orderDataFriends,
        offset: oset,
        limit: constant.limitTweets
    })
    return utils.classResponse(true, friendTweets, "")
}

/**
 * Checks if tweet was liked by signed in user or not
 * @param {*Object} whereData 
 */
exports.isTweetLikedByMe = async (whereData) => {
    const isTweetLikedByMe = await likes.findOne({
        where: whereData
    })
    if (isTweetLikedByMe == null) {
        return utils.classResponse(false, "", "")
    }
    return utils.classResponse(true, isTweetLikedByMe, "")
}
