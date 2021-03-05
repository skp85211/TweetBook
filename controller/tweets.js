const tweetClass = require("../classes/Tweets/Tweets")
const CommentClass = require("../classes/Comment/Comment")
const constant = require("../classes/Tweets/constant")
const utils = require("../utils")
const TEXT = require("../text").TEXT
const tweetFunction = require("../classes/Tweets/Function")

/**
 * for ALL tweets (latest tweet with pagination)
 * @param {object} req 
 * @param {object} res 
 */
exports.allLatestTweets = async(req, res) => {
    try {
        let pageno = parseInt(req.params.pageno)
        pageno = pageno-1;
        let pageSize = constant.limitTweets;
        let offsetValue = (pageno*pageSize);
        let reqUserid = parseInt(req.body.userid)
        if (!reqUserid) {
            return utils.sendResponse(res, false, {}, TEXT.noUserId)
        }
        const rowsRecord = await tweetClass.allLatestTweets(reqUserid, offsetValue)
        return utils.sendResponse(res, true, rowsRecord.data, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}


/**
 * create Tweet
 * @param {object} req 
 * @param {object} res 
 */
exports.createTweet = async(req, res) => {
    let reqUserid = parseInt(req.body.userid)
    let reqTweet = req.body.tweet.toString()
    let errors = tweetFunction.emptyFieldCreateTweet(reqUserid, reqTweet)
    if(errors.length){
        return utils.sendResponse(res, false, {}, errors.join(","))
    }
    try {
        const useridCheckResponse = await CommentClass.checkUserIdExists(reqUserid)
        if(useridCheckResponse.data.length == 0){
            return utils.sendResponse(res, false, {} ,TEXT.noUserExists)
        }
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }

    try {
        const newTweetResponse = await tweetClass.createTweet(reqUserid, reqTweet)
        return utils.sendResponse(res, true, newTweetResponse.data, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}


/**
 * read Tweet
 * @param {object} req 
 * @param {object} res 
 */
exports.readTweet = async(req, res) => {
    let reqUserid = parseInt(req.body.userid)
    if(!reqUserid){
        return utils.classResponse(false, {}, TEXT.noUserId)
    }
    try {
        let tweetsResponse = await tweetClass.readTweet(reqUserid)
        return utils.sendResponse(res, true, tweetsResponse.data, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}


/**
 * update Tweet
 * @param {object} req 
 * @param {object} res 
 */
exports.updateTweet = async(req, res) => {
    let reqUserid = parseInt(req.body.userid)
    let reqId = parseInt(req.body.id)
    let reqTweet = req.body.tweet.toString()
    let errors = tweetFunction.emptyFieldUpdateTweet(reqId, reqUserid, reqTweet)
    if(errors.length){
        return utils.sendResponse(res, false, {}, errors.join(","))
    }
    try {
        let updateTweetResponse = await tweetClass.updateTweet(reqId, reqUserid, reqTweet)
        return utils.sendResponse(res, true, updateTweetResponse.data, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}


/**
 * Tweet with all comments along with user name
 * @param {object} req 
 * @param {object} res 
 */
exports.allTweetCommentsWithUser = async(req, res) => {
    try {
        let pageno = parseInt(req.params.pageno);
        let tweetid = parseInt(req.params.tid)
        if(!pageno || !tweetid){
            return utils.sendResponse(res, false, {}, TEXT.noPageNo + TEXT.noTweetId)
        }
        pageno = pageno-1;
        const pageSize = constant.limitTweets;
        let offsetValue = (pageno*pageSize);
        const rowsRecordResponse = await tweetClass.allTweetCommentsWithUser(tweetid, offsetValue)
        return utils.sendResponse(res, true, rowsRecordResponse.data, "")
    } catch (error) {
        return utils.sendResponse(res, false, {}, error)
    }
}
