const friendshipClass = require("../classes/Friendship/Friendship")
const utils = require("../utils")
const TEXT = require("../text").TEXT
const constant = require("../classes/Friendship/Constant")
const friendshipClassFunc = require("../classes/Friendship/Function")

/**
 * Check if the users are in any relation or not, if not send request with status pending (0)
 * @param {Object} req 
 * @param {Object} res 
 */
exports.friendRequest = async(req, res) => {
    let user1id = parseInt(req.body.userid)
    let user2id = parseInt(req.params.userid2)
    const action_id = user1id
    if(!user1id || !user2id || !action_id){
        return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
    }

    //to make sure user1id < userid2 (always)
    if (user1id > user2id) {
        let temp = user1id
        user1id = user2id
        user2id = temp

    }
    try {
        const userPairResponse = await friendshipClass.friendshipCheck(user1id, user2id)
        if (userPairResponse.data.length != 0) {
            return utils.sendResponse(res, false, {}, TEXT.alreadyInRelation)
        }
        const friendRequestResponse = await friendshipClass.friendshipRequestSend(user1id, user2id, action_id)
        const friendRequest = friendRequestResponse.data
        return utils.sendResponse(res, true, friendRequest, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}


/**
 * friend Request Accept , changing status -> Accepted(1), action_id
 * @param {object} req 
 * @param {object} res 
 */
exports.friendRequestAccept = async(req, res) => {
    let user1id = parseInt(req.body.userid)
    let user2id = parseInt(req.params.userid2)
    let action_id = user1id
    if(!user1id || !user2id || !action_id){
        return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
    }
    if (user1id > user2id) {
        let temp = user1id
        user1id = user2id
        user2id = temp
    }
    try {
        const friendAcceptResponse = await friendshipClass.friendRequestUpdate(constant.acceptedStatus, action_id, user1id, user2id)
        return utils.sendResponse(res, true, {}, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}

/**
 * //friend request rejected , status->2 (Blocked), update action_id
 * @param {object} req 
 * @param {object} res 
 */
exports.friendRequestReject = async(req, res) => {
    let user1id = parseInt(req.body.userid)
    let user2id = parseInt(req.params.userid2)
    let action_id = user1id
    if(!user1id || !user2id || !action_id){
        return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
    }
    if (user1id > user2id) {
        let temp = user1id
        user1id = user2id
        user2id = temp
    }
    try {
        const friendRejectResponse = await friendshipClass.friendRequestUpdate(constant.blockedStatus, action_id, user1id, user2id)
        return utils.sendResponse(res, true, {}, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}

/**
 * Finds friend list of user and show all friends all tweets
 * @param {object} req 
 * @param {object} res 
 */
exports.friendsTweet = async(req, res) => {
    let pageno = parseInt(req.params.pageno);
    let reqUserid = parseInt(req.body.userid)
    if(!pageno || !reqUserid){
        return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
    }
    pageno = pageno - 1;
    let psize = constant.limitTweets;
    let oset = (pageno * psize);

    const friendListResponse = await friendshipClass.friendsList(reqUserid)
    const friendList = friendListResponse.data
    //if user doesn't have any friends , show all latest tweets
    if (friendList.length == 0) {
        const rowsRecordResponse = await friendshipClass.allLatestTweets(reqUserid, oset)
        const rowsRecord = rowsRecordResponse.data
        for(const dataItems of rowsRecord){
            dataItems["tweetLikesCount"] = friendshipClassFunc.countDiffLikes(dataItems.likes)
            if(dataItems.likes.length == 0){
                dataItems["isTweetLikedByMe"] = false
            }
            else{
                let tweetid = dataItems.id
                const isTweetLikedByMe = await friendshipClass.isTweetLikedByMe(reqUserid, tweetid)
                if(isTweetLikedByMe.success == false){
                    
                    dataItems["isTweetLikedByMe"] = false
                }
                else{
                    dataItems["isTweetLikedByMe"] = true
                    dataItems["likeType"] = isTweetLikedByMe.data.like_type
                }
            }
        }
        return utils.sendResponse(res, true, rowsRecord, "")
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

    const friendTweetsResponse = await friendshipClass.friendsTweets(friendListArr, oset)
    const friendTweets = friendTweetsResponse.data
    for(const dataItems of friendTweets){
        dataItems["tweetLikesCount"] = friendshipClassFunc.countDiffLikes(dataItems.likes)
        if(dataItems.likes.length == 0){
            dataItems["isTweetLikedByMe"] = false
        }
        else{
            let tweetid = dataItems.id
            const isTweetLikedByMe = await friendshipClass.isTweetLikedByMe(reqUserid, tweetid)
            if(isTweetLikedByMe.success == false){
                
                dataItems["isTweetLikedByMe"] = false
            }
            else{
                dataItems["isTweetLikedByMe"] = true
                dataItems["likeType"] = isTweetLikedByMe.data.like_type
            }
        }
    }
    return utils.sendResponse(res, true, friendTweets, "")
}

/**
 * Gets all friend request that user can accept or reject
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
exports.allFriendRequest = async(req, res) => {
    let reqUserid = parseInt(req.body.userid)
    if(!reqUserid){
        return utils.sendResponse(res, false, {}, TEXT.noUserId)
    }
    const friendListResponse = await friendshipClass.allFriendsRequestList(reqUserid)
    const friendList = friendListResponse.data
    if(friendList.length == 0) {
        return utils.sendResponse(res, false, {}, TEXT.noFriends)
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
    const allFriendRequestResponse = await friendshipClass.allFriends(friendListArr)
    return utils.sendResponse(res, true, allFriendRequestResponse.data, "")
}