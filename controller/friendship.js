const Friendship = require("../classes/Friendship/Friendship")

const FriendshipFunc = require("../classes/Friendship/Function")
const utils = require("../utils")
const TEXT = require("../text").TEXT
const Constant = require("../classes/Friendship/Constant")

/**
 * Check if the users are in any relation or not, if not send request with status pending (0)
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 */
exports.friendRequest = async(req, res, next) => {
    let user1id = parseInt(req.userid)
    let user2id = parseInt(req.params.userid2)
    let action_id = user1id
    if(!user1id || isNaN(user1id) || !user2id || isNaN(user2id) || !action_id || isNaN(action_id)){
        return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
    }
    //to make sure user1id < userid2 (always)
    if (user1id > user2id) {
        let temp = user1id
        user1id = user2id
        user2id = temp
    }
    try {
        let userPairResponse = await Friendship.friendshipCheck(user1id, user2id)
        if (userPairResponse.data.length != 0) {
            return utils.sendResponse(res, false, {}, TEXT.alreadyInRelation)
        }
        let friendRequestResponse = await Friendship.friendshipRequestSend(user1id, user2id, action_id)
        let friendRequest = friendRequestResponse.data
        return utils.sendResponse(res, true, friendRequest, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}


/**
 * friend Request Accept , changing status -> Accepted(1), action_id
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 */
exports.friendRequestAccept = async(req, res, next) => {
    let user1id = parseInt(req.userid)
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
        await Friendship.friendRequestUpdate(Constant.acceptedStatus, action_id, user1id, user2id)
        return utils.sendResponse(res, true, {}, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}

/**
 * //friend request rejected , status->2 (Blocked), update action_id
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 */
exports.friendRequestReject = async(req, res, next) => {
    let user1id = parseInt(req.userid)
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
        await Friendship.friendRequestUpdate(Constant.blockedStatus, action_id, user1id, user2id)
        return utils.sendResponse(res, true, {}, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}

/**
 * Finds friend list of user and show all friends all tweets
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 */
exports.friendsTweet = async(req, res, next) => {
    let pageno = parseInt(req.headers.pageno);
    if(!pageno){
        pageno = Constant.defaultPageNo
    }
    let reqUserid = parseInt(req.userid)
    if(!reqUserid){
        return utils.sendResponse(res, false, {}, TEXT.someFieldsMissing)
    }
    pageno = pageno - 1;
    let psize = Constant.limitTweets;
    let oset = (pageno * psize);

    let friendListResponse = await Friendship.friendsList(reqUserid)
    let friendList = friendListResponse.data
    //if user doesn't have any friends , show all latest tweets
    if (friendList.length == 0) {
        let rowsRecordResponse = await Friendship.allLatestTweets(reqUserid, oset)
        let rowsRecord = rowsRecordResponse.data
        for(let dataItems of rowsRecord){
            dataItems["tweetLikesCount"] = FriendshipFunc.countDiffLikes(dataItems.likes)
            if(dataItems.likes.length == 0){
                dataItems["isTweetLikedByMe"] = false
            }
            else{
                let tweetid = dataItems.id
                let isTweetLikedByMe = await Friendship.isTweetLikedByMe(reqUserid, tweetid)
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
    for (let dataItems of friendList) {
        if (dataItems.user1_id != req.params.uid) {
            friendListArr.push(dataItems.user1_id)
        }
        else {
            friendListArr.push(dataItems.user2_id)
        }
    }

    let friendTweetsResponse = await Friendship.friendsTweets(friendListArr, oset)
    let friendTweets = friendTweetsResponse.data
    for(let dataItems of friendTweets){
        dataItems["tweetLikesCount"] = FriendshipFunc.countDiffLikes(dataItems.likes)
        if(dataItems.likes.length == 0){
            dataItems["isTweetLikedByMe"] = false
        }
        else{
            let tweetid = dataItems.id
            let isTweetLikedByMe = await Friendship.isTweetLikedByMe(reqUserid, tweetid)
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
 * @param {Object} next
 * @returns 
 */
exports.allFriendRequest = async(req, res, next) => {
    let reqUserid = parseInt(req.userid)
    if(!reqUserid){
        return utils.sendResponse(res, false, {}, TEXT.noUserId)
    }
    let friendListResponse = await Friendship.allFriendsRequestList(reqUserid)
    let friendList = friendListResponse.data
    if(friendList.length == 0) {
        return utils.sendResponse(res, false, {}, TEXT.noFriends)
    }
    let friendListArr = []
    for (let dataItems of friendList) {
        if (dataItems.user1_id != reqUserid) {
            friendListArr.push(dataItems.user1_id)
        }
        else {
            friendListArr.push(dataItems.user2_id)
        }
    }
    let allFriendRequestResponse = await Friendship.allFriends(friendListArr)
    return utils.sendResponse(res, true, allFriendRequestResponse.data, "")
}