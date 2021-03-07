const { Op } = require("sequelize")

const Tweets = require("../../model/Tweets")
const Friendship = require("../../model/Friendship")
const User = require("../../model/User")
const Likes = require("../../model/Likes")

const constant = require("./constant").Constant
const utils = require("../../utils")
const TEXT = require("../../text").TEXT

/**
 * Gets list of all friends from friends list array of user
 * @param {Array} friendListArr 
 * @returns 
 */
const allFriends = async(friendListArr) => {
    let whereData = {
        id: friendListArr
    }
    let allFriends = await User.findAll({
        where : whereData,
        attributes : ['id', 'name', 'email']
    })
    return utils.classResponse(true, allFriends, "")
}

/**
 * check if users are already in any relation (checks relation status)
 * @param {Integer} userid1 
 * @param {Integer} userid2 
 * @returns 
 */
const friendshipCheck = async (userid1, userid2) => {
    let whereData = {
        user1_id: userid1,
        user2_id: userid2
    }
    let userPair = await Friendship.findAll({
        where: whereData
    })
    return utils.classResponse(true, userPair, "")
}

/**
 * Sends friend request to other user, changes status to pending and actionid 
 * @param {Integer} user1id 
 * @param {Integer} user2id 
 * @param {Integer} action_id 
 * @returns 
 */
const friendshipRequestSend = async (user1id, user2id, action_id) => {
    let whereDataCreate = {
        user1_id: user1id,
        user2_id: user2id,
        status: constant.pendingStatus,
        action_uid: action_id
    }
    let friendRequest = await Friendship.create(whereDataCreate)
    return utils.classResponse(true, friendRequest, "")
}

/**
 * friend Request Accept/Reject , changing status -> Accepted(1) or Rejected(2)=>Blocked, action_id of user who requested this action
 * @param {Integer} acceptRejectStatus 
 * @param {Integer} action_id 
 * @param {Integer} user1id 
 * @param {Integer} user2id 
 * @returns 
 */
const friendRequestUpdate = async (acceptRejectStatus, action_id, user1id, user2id) => {
    let updateData = {
        status: acceptRejectStatus,
        action_uid: action_id
    }
    let whereData = {
        user1_id: user1id,
        user2_id: user2id
    }
    let friendshipUpdate = await Friendship.update(updateData, {
        where: whereData
    })
    return utils.classResponse(true, friendshipUpdate, "")
}

/**
 * List all friends of particular user
 * @param {Integer} reqUserid 
 * @returns 
 */
const friendsList = async (reqUserid) => {
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
    let friendList = await Friendship.findAll({
        where: whereData
    })
    return utils.classResponse(true, friendList, "")
}

/**
 * gets all friends request that user have to accept or reject
 * @param {Integer} reqUserid 
 * @returns 
 */
const allFriendsRequestList = async (reqUserid) => {
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
    let friendList = await Friendship.findAll({
        where: whereData
    })
    return utils.classResponse(true, friendList, "")
}

/**
 * Find tweets of all user id who are user's friends
 * @param {Array} friendListArr 
 * @param {Integer} oset 
 * @returns 
 */
const friendsTweets = async (friendListArr, oset) => {
    let whereDataFriends = {
        uid: friendListArr
    }
    let includeDataFriends = [
        {
            model: User, as: "user",
            attributes: ['id', 'name']
        },
        {
            model: Likes, as: "likes",
            where:{
                entity_type : TEXT.entityTweet
            },
            required : false
        }
    ]
    let orderDataFriends = [
        ['createdAt', 'DESC']
    ]
    let friendTweets = await Tweets.findAll({
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
 * @param {Integer} reqUserid 
 * @param {Integer} tweetid 
 * @returns 
 */
const isTweetLikedByMe = async (reqUserid, tweetid) => {
    let whereData = {
        user_id : reqUserid,
        entity_type : TEXT.entityTweet,
        entity_id : tweetid
    }
    let isTweetLikedByMe = await Likes.findOne({
        where: whereData
    })
    if (isTweetLikedByMe == null) {
        return utils.classResponse(false, "", "")
    }
    return utils.classResponse(true, isTweetLikedByMe, "")
}

/**
 * Gets all latest tweets of users
 * @param {Integer} reqUserid 
 * @param {Integer} oset 
 * @returns 
 */
const allLatestTweets = async (reqUserid, oset) => {
    let whereData = {
        uid:{
            [Op.ne] : reqUserid
        }
    }
    let includeData = [
        {
            model:User, as:"user",
            attributes:['id', 'name']
        },
        {
            model: Likes, as: "likes",
            where:{
                entity_type:TEXT.entityTweet
            },
            required : false
        }
    ]
    let orderData = [
        ['createdAt', 'DESC']
    ]
    let { count, rows } = await Tweets.findAndCountAll({
        where: whereData,
        include: includeData,
        order: orderData,
        offset: oset,
        limit: constant.limitTweets
    })
    return utils.classResponse(true, rows, "")
}

module.exports = { allFriends, friendshipCheck, friendshipRequestSend, friendRequestUpdate, friendsList, allFriendsRequestList, friendsTweets, isTweetLikedByMe, allLatestTweets }