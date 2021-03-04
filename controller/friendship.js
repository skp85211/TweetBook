const userdb = require("../model/User")
const tweetClass = require("../classes/Tweets/Tweets")
const friendshipClass = require("../classes/Friendship/Friendship")
const utils = require("../utils")
const TEXT = require("../text").TEXT
const constant = require("../classes/Friendship/Constant")
const likes = require("../model/Likes")
const friendshipClassFunc = require("../classes/Friendship/Function")
const { Op } = require("sequelize")

/**
 * Check if the users are in any relation or not, if not send request with status pending (0)
 * @param {Object} req 
 * @param {Object} res 
 */
exports.friendRequest = async(req, res) => {
    let user1id = parseInt(req.params.userid1)
    let user2id = parseInt(req.params.userid2)
    const action_id = parseInt(req.params.userid1)
    if(!user1id || !user2id || !action_id){
        return res.send(utils.sendResponse(false, "", TEXT.someFieldsMissing))
    }

    //to make sure user1id < userid2 (always)
    if (user1id > user2id) {
        let temp = user1id
        user1id = user2id
        user2id = temp

    }
    let whereDataCheck = {
        user1_id: user1id,
        user2_id: user2id
    }
    try {
        const userPairResponse = await friendshipClass.friendshipCheck(whereDataCheck)
        const userPair = userPairResponse.data
        if (userPair.length != 0) {
            res.send(utils.sendResponse(false, "", TEXT.alreadyInRelation))
        }

        let whereDataCreate = {
            user1_id: user1id,
            user2_id: user2id,
            status: constant.pendingStatus,
            action_uid: action_id
        }
        const friendRequestResponse = await friendshipClass.friendshipRequestSend(whereDataCreate)
        const friendRequest = friendRequestResponse.data
        res.send(utils.sendResponse(true, friendRequest, ""))
    } catch (error) {
        res.send(utils.sendResponse(false, "", error))
    }
}


/**
 * friend Request Accept , changing status -> Accepted(1), action_id
 * @param {object} req 
 * @param {object} res 
 */
exports.friendRequestAccept = async(req, res) => {
    let user1id = parseInt(req.params.userid1)
    let user2id = parseInt(req.params.userid2)
    let action_id = parseInt(req.params.userid1)
    if(!user1id || !user2id || !action_id){
        return res.send(utils.sendResponse(false, "", TEXT.someFieldsMissing))
    }
    if (user1id > user2id) {
        let temp = user1id
        user1id = user2id
        user2id = temp
    }

    let updateData = {
        status: constant.acceptedStatus,
        action_uid: action_id
    }
    let whereData = {
        user1_id: user1id,
        user2_id: user2id
    }
    try {
        const friendAcceptResponse = await friendshipClass.friendRequestUpdate(updateData, whereData)
        res.send(utils.sendResponse(true, "", ""))
    } catch (error) {
        res.send(utils.sendResponse(false, "", error));
    }
}

/**
 * //friend request rejected , status->2 (Blocked), update action_id
 * @param {object} req 
 * @param {object} res 
 */
exports.friendRequestReject = async(req, res) => {
    let user1id = parseInt(req.params.userid1)
    let user2id = parseInt(req.params.userid2)
    let action_id = parseInt(req.params.userid1)
    if(!user1id || !user2id || !action_id){
        return res.send(utils.sendResponse(false, "", TEXT.someFieldsMissing))
    }
    if (user1id > user2id) {
        let temp = user1id
        user1id = user2id
        user2id = temp
    }

    let updateData = {
        status: constant.blockedStatus,
        action_uid: action_id
    }
    let whereData = {
        user1_id: user1id,
        user2_id: user2id
    }
    try {
        const friendRejectResponse = await friendshipClass.friendRequestUpdate(updateData, whereData)
        res.send(utils.sendResponse(true, "", ""))
    } catch (error) {
        res.send(utils.sendResponse(false, "", error));
    }
}

/**
 * Finds friend list of user and show all friends all tweets
 * @param {object} req 
 * @param {object} res 
 */
exports.friendsTweet = async(req, res) => {
    let pageno = parseInt(req.params.pageno);
    let reqUserid = parseInt(req.params.uid)
    if(!pageno || !reqUserid){
        return res.send(utils.sendResponse(false, "", TEXT.someFieldsMissing))
    }
    pageno = pageno - 1;
    let psize = constant.limitTweets;
    let oset = (pageno * psize);
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

    const friendListResponse = await friendshipClass.friendsList(whereData)
    const friendList = friendListResponse.data
    //if user doesn't have any friends , show all latest tweets
    if (friendList.length == 0) {
        let whereDataNotFriends = {
            uid:{
                [Op.ne] : reqUserid
            }
        }
        let includeDataNotFriends = [
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
        let orderDataNotFriends = [
            ['createdAt', 'DESC']
        ]
        const rowsRecordResponse = await tweetClass.allLatestTweets(whereDataNotFriends, includeDataNotFriends, orderDataNotFriends, oset)
        const rowsRecord = rowsRecordResponse.data
        for(const dataItems of rowsRecord){
            dataItems["tweetLikesCount"] = friendshipClassFunc.countDiffLikes(dataItems.likes)
            if(dataItems.likes.length == 0){
                dataItems["isTweetLikedByMe"] = false
            }
            else{
                let tweetid = dataItems.id
                let whereData = {
                    user_id : reqUserid,
                    entity_type : TEXT.entityTweet,
                    entity_id : tweetid
                }
                const isTweetLikedByMe = await friendshipClass.isTweetLikedByMe(whereData)
                if(isTweetLikedByMe.success == false){
                    
                    dataItems["isTweetLikedByMe"] = false
                }
                else{
                    dataItems["isTweetLikedByMe"] = true
                    dataItems["likeType"] = isTweetLikedByMe.data.like_type
                }
            }
        }
        res.send(utils.sendResponse(true, rowsRecord, ""))
    }

    //IF user have atleast one friend show them friend's tweets
    let friendListArr = []
    for (const dataItems of friendList) {
        if (dataItems.user1_id != req.params.uid) {
            friendListArr.push(dataItems.user1_id)
        }
        else {
            friendListArr.push(dataItems.user2_id)
        }
    }
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
    const friendTweetsResponse = await friendshipClass.friendsTweets(whereDataFriends, includeDataFriends, orderDataFriends, oset)
    const friendTweets = friendTweetsResponse.data
    for(const dataItems of friendTweets){
        dataItems["tweetLikesCount"] = friendshipClassFunc.countDiffLikes(dataItems.likes)
        if(dataItems.likes.length == 0){
            dataItems["isTweetLikedByMe"] = false
        }
        else{
            let tweetid = dataItems.id
            let whereData = {
                user_id : reqUserid,
                entity_type : TEXT.entityTweet,
                entity_id : tweetid
            }
            const isTweetLikedByMe = await friendshipClass.isTweetLikedByMe(whereData)
            if(isTweetLikedByMe.success == false){
                
                dataItems["isTweetLikedByMe"] = false
            }
            else{
                dataItems["isTweetLikedByMe"] = true
                dataItems["likeType"] = isTweetLikedByMe.data.like_type
            }
        }
    }
    res.send(utils.sendResponse(true, friendTweets, ""))
}


exports.allFriendRequest = async(req, res) => {
    let reqUserid = parseInt(req.body.userid)
    if(!reqUserid){
        return res.send(utils.sendResponse(false, "", TEXT.noUserId))
    }
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
    const friendListResponse = await friendshipClass.friendsList(whereData)
    const friendList = friendListResponse.data
    if(friendList.length == 0) {
        return res.send(utils.sendResponse(false, "", TEXT.noFriends))
    }
    let friendListArr = []
    for (const dataItems of friendList) {
        if (dataItems.user1_id != reqUserid) {
            friendListArr.push(dataItems.user1_id)
        }
        else {
            friendListArr.push(dataItems.user2_id)
        }
    }
    let whereDataFriends = {
        id: friendListArr
    }
    const allFriendRequestResponse = await friendshipClass.allFriends(whereDataFriends)
    res.send(utils.sendResponse(true, allFriendRequestResponse.data, ""))
}