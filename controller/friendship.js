const utils = require("../utils")

const Friendship = require("../classes/Friendship/Friendship")

const FriendshipFunc = require("../classes/Friendship/Function")
const Constant = require("../classes/Friendship/Constant").Constant
const ERRORS = require("../errorConstants").ERRORS

/**
 * Check if the users are in any relation or not, if not send request with status pending (0)
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 * @returns 
 */
exports.friendRequest = async (req, res, next) => {
    let body = req.body
    let user1id = parseInt(req.userid)
    let user2id = parseInt(body.userid2)
    let action_id = user1id
    if (!user1id || isNaN(user1id) || !user2id || isNaN(user2id) || !action_id || isNaN(action_id)) {
        return utils.sendResponse(res, false, {}, ERRORS.someFieldsMissing)
    }
    //to make sure user1id < userid2 (always)
    if (user1id > user2id) {
        let temp = user1id
        user1id = user2id
        user2id = temp
    }
    let userPairResponse = await Friendship.friendshipCheck(user1id, user2id)
    if (userPairResponse.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    if (userPairResponse.data.length != 0) {
        return utils.sendResponse(res, false, {}, ERRORS.alreadyInRelation)
    }
    let friendRequestResponse = await Friendship.friendshipRequestSend(user1id, user2id, action_id)
    if (friendRequestResponse.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    let friendRequest = friendRequestResponse.data
    return utils.sendResponse(res, true, friendRequest, "")
}

/**
 * friend Request Accept , changing status -> Accepted(1), action_id
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 * @returns 
 */
exports.friendRequestAccept = async (req, res, next) => {
    let body = req.body
    let user1id = parseInt(req.userid)
    let user2id = parseInt(body.userid2)
    let action_id = user1id
    if (!user1id || isNaN(user1id) || !user2id || isNaN(user2id) || !action_id || isNaN(action_id)) {
        return utils.sendResponse(res, false, {}, ERRORS.someFieldsMissing)
    }
    if (user1id > user2id) {
        let temp = user1id
        user1id = user2id
        user2id = temp
    }
    let friendRequestUpdateResponse = await Friendship.friendRequestUpdate(Constant.acceptedStatus, action_id, user1id, user2id)
    if (friendRequestUpdateResponse.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    return utils.sendResponse(res, true, {}, "")
}

/**
 * //friend request rejected , status->2 (Blocked), update action_id
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 * @returns 
 */
exports.friendRequestReject = async (req, res, next) => {
    let body = req.body
    let user1id = parseInt(req.userid)
    let user2id = parseInt(body.userid2)
    let action_id = user1id
    if (!user1id || isNaN(user1id) || !user2id || isNaN(user2id) || !action_id || isNaN(action_id)) {
        return utils.sendResponse(res, false, {}, ERRORS.someFieldsMissing)
    }
    if (user1id > user2id) {
        let temp = user1id
        user1id = user2id
        user2id = temp
    }
    let friendRequestUpdateResponse = await Friendship.friendRequestUpdate(Constant.blockedStatus, action_id, user1id, user2id)
    if (friendRequestUpdateResponse.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    return utils.sendResponse(res, true, {}, "")
}

/**
 * Finds friend list of user and show all friends all tweets
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 * @returns 
 */
exports.friendsTweet = async (req, res, next) => {
    let pageno = parseInt(req.query.pageno);
    if (!pageno || isNaN(pageno)) {
        pageno = Constant.defaultPageNo
    }
    let reqUserid = parseInt(req.userid)
    if (!reqUserid || isNaN(reqUserid)) {
        return utils.sendResponse(res, false, {}, ERRORS.someFieldsMissing)
    }
    pageno = pageno - 1;
    let psize = Constant.limitTweets;
    let oset = (pageno * psize);

    let friendListResponse = await Friendship.friendsList(reqUserid)
    if (friendListResponse.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    let friendList = friendListResponse.data
    //if user doesn't have any friends , show all latest tweets
    if (friendList.length == 0) {
        let rowsRecordResponse = await Friendship.allLatestTweets(reqUserid, oset)
        if (rowsRecordResponse.success == false) {
            return utils.sendResponse(res, false, {}, ERRORS.dbError)
        }
        let rowsRecord = rowsRecordResponse.data
        for (let dataItems of rowsRecord) {
            dataItems["tweetLikesCount"] = FriendshipFunc.countDiffLikes(dataItems.likes)
            if (dataItems.likes.length == 0) {
                dataItems["isTweetLikedByMe"] = false
            }
            else {
                let tweetid = dataItems.id
                let isTweetLikedByMe = await Friendship.isTweetLikedByMe(reqUserid, tweetid)
                if (isTweetLikedByMe.success == false) {
                    return utils.sendResponse(res, false, {}, ERRORS.dbError)
                }
                if (isTweetLikedByMe.data == null) {
                    dataItems["isTweetLikedByMe"] = false
                }
                else {
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
        if (dataItems.user1_id != reqUserid) {
            friendListArr.push(dataItems.user1_id)
        }
        else {
            friendListArr.push(dataItems.user2_id)
        }
    }

    let friendTweetsResponse = await Friendship.friendsTweets(friendListArr, oset)
    if (friendTweetsResponse.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    let friendTweets = friendTweetsResponse.data
    for (let dataItems of friendTweets) {
        dataItems["tweetLikesCount"] = FriendshipFunc.countDiffLikes(dataItems.likes)
        if (dataItems.likes.length == 0) {
            dataItems["isTweetLikedByMe"] = false
        }
        else {
            let tweetid = dataItems.id
            let isTweetLikedByMe = await Friendship.isTweetLikedByMe(reqUserid, tweetid)
            if (isTweetLikedByMe.success == false) {
                return utils.sendResponse(res, false, {}, ERRORS.dbError)
            }
            if (isTweetLikedByMe.data == null) {

                dataItems["isTweetLikedByMe"] = false
            }
            else {
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
exports.allFriendRequest = async (req, res, next) => {
    let reqUserid = parseInt(req.userid)
    if (!reqUserid || isNaN(reqUserid)) {
        return utils.sendResponse(res, false, {}, ERRORS.noUserId)
    }
    let friendListResponse = await Friendship.allFriendsRequestList(reqUserid)
    if (friendListResponse.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    let friendList = friendListResponse.data
    if (friendList.length == 0) {
        return utils.sendResponse(res, false, {}, ERRORS.noFriends)
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
    if (allFriendRequestResponse.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    return utils.sendResponse(res, true, allFriendRequestResponse.data, "")
}