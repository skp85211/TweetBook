const utils = require("../utils")

const TweetClass = require("../classes/Tweets/Tweets")
const CommentClass = require("../classes/Comment/Comment")

const TweetFunction = require("../classes/Tweets/Function")
const Constant = require("../classes/Tweets/Constant").Constant
const ERRORS = require("../errorConstants").ERRORS

/**
 * for ALL tweets (latest tweet with pagination)
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 * @returns
 */
exports.allLatestTweets = async (req, res, next) => {
    let pageno = parseInt(req.query.pageno)
    pageno = pageno - 1;
    let pageSize = Constant.limitTweets;
    let offsetValue = (pageno * pageSize);
    let reqUserid = parseInt(req.userid)
    if (!reqUserid || isNaN(reqUserid)) {
        return utils.sendResponse(res, false, {}, ERRORS.noUserId)
    }
    let rowsRecord = await TweetClass.allLatestTweets(reqUserid, offsetValue)
    if (rowsRecord.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    return utils.sendResponse(res, true, rowsRecord.data, "")
}

/**
 * create Tweet
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 * @returns
 */
exports.createTweet = async (req, res, next) => {
    let body = req.body
    let reqUserid = parseInt(req.userid)
    let reqTweet = (body.tweet || "")
    let errors = TweetFunction.emptyFieldCreateTweet(reqUserid, reqTweet)
    if (errors.length) {
        return utils.sendResponse(res, false, {}, errors.join(","))
    }
    let useridCheckResponse = await CommentClass.checkUserIdExists(reqUserid)
    if (useridCheckResponse.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    if (useridCheckResponse.data.length == 0) {
        return utils.sendResponse(res, false, {}, ERRORS.noUserExists)
    }

    let newTweetResponse = await TweetClass.createTweet(reqUserid, reqTweet)
    if (newTweetResponse.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    return utils.sendResponse(res, true, newTweetResponse.data, "")
}

/**
 * read Tweet
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 * @returns
 */
exports.readTweet = async (req, res, next) => {
    let reqUserid = parseInt(req.userid)
    if (!reqUserid || isNaN(reqUserid)) {
        return utils.classResponse(false, {}, ERRORS.noUserId)
    }
    let tweetsResponse = await TweetClass.readTweet(reqUserid)
    if (tweetsResponse.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    return utils.sendResponse(res, true, tweetsResponse.data, "")
}

/**
 * Delete Tweet
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 * @returns
 */
exports.deleteTweet = async (req, res, next) => {
    let body = req.body
    let reqId = parseInt(body.id)
    let reqUserid = parseInt(req.userid)
    if (!reqId || isNaN(reqId) || !reqUserid || isNaN(reqUserid)) {
        return utils.sendResponse(res, false, {}, ERRORS.someFieldsMissing)
    }
    let deleteCommentResponse = await TweetClass.deleteTweet(reqId, reqUserid)
    if (deleteCommentResponse.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    return utils.sendResponse(res, true, deleteCommentResponse.data, "")
}

/**
 * update Tweet
 * @param {object} req 
 * @param {object} res
 * @param {Object} next 
 * @returns
 */
exports.updateTweet = async (req, res, next) => {
    let body = req.body
    let reqUserid = parseInt(req.userid)
    let reqId = parseInt(body.id)
    let reqTweet = (body.tweet || "")
    let errors = TweetFunction.emptyFieldUpdateTweet(reqId, reqUserid, reqTweet)
    if (errors.length) {
        return utils.sendResponse(res, false, {}, errors.join(","))
    }
    let updateTweetResponse = await TweetClass.updateTweet(reqId, reqUserid, reqTweet)
    if (updateTweetResponse.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    return utils.sendResponse(res, true, updateTweetResponse.data, "")
}

/**
 * Tweet with all comments along with user name
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 * @returns
 */
exports.allTweetCommentsWithUser = async (req, res, next) => {
    let pageno = parseInt(req.query.pageno);
    if (!pageno || isNaN(pageno)) {
        pageno = Constant.defaultPageNo
    }
    let tweetid = parseInt(req.query.tid)
    if (!tweetid || isNaN(tweetid)) {
        return utils.sendResponse(res, false, {}, ERRORS.noTweetId)
    }
    pageno = pageno - 1;
    let pageSize = Constant.limitTweets;
    let offsetValue = (pageno * pageSize);
    let rowsRecordResponse = await TweetClass.allTweetCommentsWithUser(tweetid, offsetValue)
    if (rowsRecordResponse.success == false) {
        return utils.sendResponse(res, false, {}, ERRORS.dbError)
    }
    return utils.sendResponse(res, true, rowsRecordResponse.data, "")
}
