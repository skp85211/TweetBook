const utils = require("../../utils")

const { Op } = require("sequelize")

const Tweets = require("../../model/Tweets")
const Friendship = require("../../model/Friendship")
const User = require("../../model/User")
const Likes = require("../../model/Likes")
const Constant = require("./Constant").Constant

const TEXT = require("../../text").TEXT

/**
 * Gets list of all friends from friends list array of user
 * @param {Array} friendListArr 
 * @returns 
 */
const allFriends = async(friendListArr) => {
    try {
        let allFriends = await User.findAll({
            where : {
                id: friendListArr
            },
            attributes : ['id', 'name', 'email']
        })
        return utils.classResponse(true, allFriends, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

/**
 * check if users are already in any relation (checks relation status)
 * @param {Integer} userid1 
 * @param {Integer} userid2 
 * @returns 
 */
const friendshipCheck = async (userid1, userid2) => {
    try {
        let userPair = await Friendship.findAll({
            where: {
                user1_id: userid1,
                user2_id: userid2
            }
        })
        return utils.classResponse(true, userPair, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

/**
 * Sends friend request to other user, changes status to pending and actionid 
 * @param {Integer} user1id 
 * @param {Integer} user2id 
 * @param {Integer} action_id 
 * @returns 
 */
const friendshipRequestSend = async (user1id, user2id, action_id) => {
    try {
        let friendRequest = await Friendship.create({
            user1_id: user1id,
            user2_id: user2id,
            status: Constant.pendingStatus,
            action_uid: action_id
        })
        return utils.classResponse(true, friendRequest, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
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
    try {
        let friendshipUpdate = await Friendship.update({
            status: acceptRejectStatus,
            action_uid: action_id
        }, {
            where: {
                user1_id: user1id,
                user2_id: user2id
            }
        })
        return utils.classResponse(true, friendshipUpdate, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

/**
 * List all friends of particular user
 * @param {Integer} reqUserid 
 * @returns 
 */
const friendsList = async (reqUserid) => {
    try {
        let friendList = await Friendship.findAll({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            { user1_id: reqUserid },
                            { user2_id: reqUserid }
                        ]
                    },
                    {
                        status: Constant.acceptedStatus
                    }
                ]
            }
        })
        return utils.classResponse(true, friendList, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

/**
 * gets all friends request that user have to accept or reject
 * @param {Integer} reqUserid 
 * @returns 
 */
const allFriendsRequestList = async (reqUserid) => {
    try {
        let friendList = await Friendship.findAll({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            { user1_id: reqUserid },
                            { user2_id: reqUserid }
                        ]
                    },
                    {
                        [Op.and]:[
                            { status: Constant.pendingStatus },
                            { action_uid : {
                                [Op.ne]:reqUserid
                            } }
                        ]
                        
                    }
                ]
            }
        })
        return utils.classResponse(true, friendList, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

/**
 * Find tweets of all user id who are user's friends
 * @param {Array} friendListArr 
 * @param {Integer} oset 
 * @returns 
 */
const friendsTweets = async (friendListArr, oset) => {
    try {
        let friendTweets = await Tweets.findAll({
            where: {
                uid: friendListArr
            },
            include: [
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
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            offset: oset,
            limit: Constant.limitTweets
        })
        return utils.classResponse(true, friendTweets, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

/**
 * Checks if tweet was liked by signed in user or not
 * @param {Integer} reqUserid 
 * @param {Integer} tweetid 
 * @returns 
 */
const isTweetLikedByMe = async (reqUserid, tweetid) => {
    try {
        let isTweetLikedByMe = await Likes.findOne({
            where: {
                user_id : reqUserid,
                entity_type : TEXT.entityTweet,
                entity_id : tweetid
            }
        })
        return utils.classResponse(true, isTweetLikedByMe, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

/**
 * Gets all latest tweets of users
 * @param {Integer} reqUserid 
 * @param {Integer} oset 
 * @returns 
 */
const allLatestTweets = async (reqUserid, oset) => {
    try {
        let { count, rows } = await Tweets.findAndCountAll({
            where: {
                uid:{
                    [Op.ne] : reqUserid
                }
            },
            include: [
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
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            offset: oset,
            limit: Constant.limitTweets
        })
        return utils.classResponse(true, rows, "")
    } catch (error) {
        return utils.classResponse(false, {}, error)
    }
}

module.exports = { allFriends, friendshipCheck, friendshipRequestSend, friendRequestUpdate, friendsList, allFriendsRequestList, friendsTweets, isTweetLikedByMe, allLatestTweets }