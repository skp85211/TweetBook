const TweetClass = require("../classes/Tweets/Tweets")
const CommentClass = require("../classes/Comment/Comment")

const TweetFunction = require("../classes/Tweets/Function")
const Constant = require("../classes/Tweets/Constant").Constant
const utils = require("../utils")
const ERRORS = require("../errorConstants").ERRORS

/**
 * for ALL tweets (latest tweet with pagination)
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 * @returns
 */
exports.allLatestTweets = async(req, res, next) => {
    try {
        let pageno = parseInt(req.headers.pageno)
        pageno = pageno-1;
        let pageSize = Constant.limitTweets;
        let offsetValue = (pageno*pageSize);
        let reqUserid = parseInt(req.userid)
        if (!reqUserid || isNaN(reqUserid)) {
            return utils.sendResponse(res, false, {}, ERRORS.noUserId)
        }
        let rowsRecord = await TweetClass.allLatestTweets(reqUserid, offsetValue)
        return utils.sendResponse(res, true, rowsRecord.data, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}

/**
 * create Tweet
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 * @returns
 */
exports.createTweet = async(req, res, next) => {
    let reqUserid = parseInt(req.userid)
    let reqTweet = (req.body.tweet || "").toString()
    let errors = TweetFunction.emptyFieldCreateTweet(reqUserid, reqTweet)
    if(errors.length){
        return utils.sendResponse(res, false, {}, errors.join(","))
    }
    try {
        let useridCheckResponse = await CommentClass.checkUserIdExists(reqUserid)
        if(useridCheckResponse.data.length == 0){
            return utils.sendResponse(res, false, {} ,ERRORS.noUserExists)
        }
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }

    try {
        let newTweetResponse = await TweetClass.createTweet(reqUserid, reqTweet)
        return utils.sendResponse(res, true, newTweetResponse.data, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}

/**
 * read Tweet
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 * @returns
 */
exports.readTweet = async(req, res, next) => {
    let reqUserid = parseInt(req.userid)
    if(!reqUserid || isNaN(reqUserid)){
        return utils.classResponse(false, {}, ERRORS.noUserId)
    }
    try {
        let tweetsResponse = await TweetClass.readTweet(reqUserid)
        return utils.sendResponse(res, true, tweetsResponse.data, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}

/**
 * Delete Tweet
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 * @returns
 */
 exports.deleteTweet = async(req, res, next) => {
    try {
        let reqId = parseInt(req.body.id)
        let reqUserid = parseInt(req.userid)
        if(!reqId || isNaN(reqId) || !reqUserid || isNaN(reqUserid)){
            return utils.sendResponse(res, false, {}, ERRORS.someFieldsMissing)
        }
        let deleteCommentResponse = await TweetClass.deleteTweet(reqId, reqUserid)
        return utils.sendResponse(res, true, deleteCommentResponse.data, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}

/**
 * update Tweet
 * @param {object} req 
 * @param {object} res
 * @param {Object} next 
 * @returns
 */
exports.updateTweet = async(req, res, next) => {
    let reqUserid = parseInt(req.userid)
    let reqId = parseInt(req.body.id)
    let reqTweet = (req.body.tweet || "").toString()
    let errors = TweetFunction.emptyFieldUpdateTweet(reqId, reqUserid, reqTweet)
    if(errors.length){
        return utils.sendResponse(res, false, {}, errors.join(","))
    }
    try {
        let updateTweetResponse = await TweetClass.updateTweet(reqId, reqUserid, reqTweet)
        return utils.sendResponse(res, true, updateTweetResponse.data, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}

/**
 * Tweet with all comments along with user name
 * @param {object} req 
 * @param {object} res 
 * @param {Object} next
 * @returns
 */
exports.allTweetCommentsWithUser = async(req, res, next) => {
    try {
        let pageno = parseInt(req.headers.pageno);
        if(!pageno || isNaN(pageno)){
            pageno = Constant.defaultPageNo
        }
        let tweetid = parseInt(req.headers.tid)
        if(!tweetid || isNaN(tweetid)){
            return utils.sendResponse(res, false, {}, ERRORS.noTweetId)
        }
        pageno = pageno-1;
        let pageSize = Constant.limitTweets;
        let offsetValue = (pageno*pageSize);
        let rowsRecordResponse = await TweetClass.allTweetCommentsWithUser(tweetid, offsetValue)
        return utils.sendResponse(res, true, rowsRecordResponse.data, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}
