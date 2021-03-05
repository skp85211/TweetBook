const tweetdb = require("../../model/Tweets")
const friendshipdb = require("../../model/Friendship")
const userdb = require("../../model/User")
const constant = require("./constant")
const utils = require("../../utils")
const likes = require("../../model/Likes")
const TEXT = require("../../text").TEXT
const { Op } = require("sequelize")

/**
 * 
 * @param {Object} whereData 
 */
exports.allFriends = async(friendListArr) => {
    let whereData = {
        id: friendListArr
    }
    const allFriends = await userdb.findAll({
        where : whereData,
        attributes : ['id', 'name', 'email']
    })
    return utils.classResponse(true, allFriends, "")
}

/**
 * check if users are already in any relation (checks relation status)
 * @param {object} whereData 
 */
exports.friendshipCheck = async (userid1, userid2) => {
    let whereData = {
        user1_id: userid1,
        user2_id: userid2
    }
    const userPair = await friendshipdb.findAll({
        where: whereData
    })
    return utils.classResponse(true, userPair, "")
}

/**
 * Sends friend request to other user, changes status to pending and actionid 
 * @param {object} whereDataCreate 
 */
exports.friendshipRequestSend = async (user1id, user2id, action_id) => {
    let whereDataCreate = {
        user1_id: user1id,
        user2_id: user2id,
        status: constant.pendingStatus,
        action_uid: action_id
    }
    const friendRequest = await friendshipdb.create(whereDataCreate)
    return utils.classResponse(true, friendRequest, "")
}

/**
 * friend Request Accept/Reject , changing status -> Accepted(1) or Rejected(2)=>Blocked, action_id
 * @param {object} updateData 
 * @param {object} whereData 
 */
exports.friendRequestUpdate = async (acceptRejectStatus, action_id, user1id, user2id) => {
    let updateData = {
        status: acceptRejectStatus,
        action_uid: action_id
    }
    let whereData = {
        user1_id: user1id,
        user2_id: user2id
    }
    const friendshipUpdate = await friendshipdb.update(updateData, {
        where: whereData
    })
    return utils.classResponse(true, friendshipUpdate, "")
}

/**
 * List all friends of particular user
 * @param {Object} whereData 
 */
exports.friendsList = async (reqUserid) => {
    let whereData = {
        [Op.and]: [
            {
                [Op.or]: [
                    { user1_id: reqUserid },
                    { user2_id: reqUserid }
                ]
            },
            {
                status: constant.acceptedStatus
            }
        ]
    }
    const friendList = await friendshipdb.findAll({
        where: whereData
    })
    return utils.classResponse(true, friendList, "")
}

/**
 * gets all friends request that user have to accept or reject
 * @param {Integer} reqUserid 
 * @returns 
 */
exports.allFriendsRequestList = async (reqUserid) => {
    let whereData = {
        [Op.and]: [
            {
                [Op.or]: [
                    { user1_id: reqUserid },
                    { user2_id: reqUserid }
                ]
            },
            {
                [Op.and]:[
                    { status: constant.pendingStatus },
                    { action_uid : {
                        [Op.ne]:reqUserid
                    } }
                ]
                
            }
        ]
    }
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
exports.friendsTweets = async (friendListArr, oset) => {
    let whereDataFriends = {
        uid: friendListArr
    }
    let includeDataFriends = [
        {
            model: userdb, as: "user",
            attributes: ['id', 'name']
        },
        {
            model: likes, as: "likes",
            where:{
                entity_type : TEXT.entityTweet
            },
            required : false
        }
    ]
    let orderDataFriends = [
        ['createdAt', 'DESC']
    ]
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
exports.isTweetLikedByMe = async (reqUserid, tweetid) => {
    let whereData = {
        user_id : reqUserid,
        entity_type : TEXT.entityTweet,
        entity_id : tweetid
    }
    const isTweetLikedByMe = await likes.findOne({
        where: whereData
    })
    if (isTweetLikedByMe == null) {
        return utils.classResponse(false, "", "")
    }
    return utils.classResponse(true, isTweetLikedByMe, "")
}

/**
 * Gets all latest tweets
 * @param {Integer} reqUserid 
 * @param {Integer} oset 
 * @returns 
 */
exports.allLatestTweets = async (reqUserid, oset) => {
    let whereData = {
        uid:{
            [Op.ne] : reqUserid
        }
    }
    let includeData = [
        {
            model:userdb, as:"user",
            attributes:['id', 'name']
        },
        {
            model: likes, as: "likes",
            where:{
                entity_type:TEXT.entityTweet
            },
            required : false
        }
    ]
    let orderData = [
        ['createdAt', 'DESC']
    ]
    const { count, rows } = await tweetdb.findAndCountAll({
        where: whereData,
        include: includeData,
        order: orderData,
        offset: oset,
        limit: constant.limitTweets
    })
    return utils.classResponse(true, rows, "")
}