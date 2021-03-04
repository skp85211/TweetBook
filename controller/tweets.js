const commentdb  = require("../model/Comments")
const userdb = require("../model/User")
const tweetClass = require("../classes/Tweets/Tweets")
const CommentClass = require("../classes/Comment/Comment")
const constant = require("../classes/Tweets/constant")
const { Op } = require("sequelize")
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
            return res.send(utils.sendResponse(false, "", TEXT.noUserId))
        }
        let whereData = {
            uid:{
                [Op.ne] : reqUserid
            }
        }
        let includeData = [
            {
                model:userdb, as:"user",
                attributes:['id', 'name']
            }
        ]
        let orderData = [
            ['createdAt', 'DESC']
        ]
        const rowsRecordResponse = await tweetClass.allLatestTweets(whereData, includeData, orderData, offsetValue)
        const rowsRecord = rowsRecordResponse.data
        res.send(utils.sendResponse(true, rowsRecord, ""))
    } catch (error) {
        res.send(utils.sendResponse(false, "", error))
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
        return res.send(utils.sendResponse(false, "", errors.join(",")))
    }
    try {
        let attr = ['id']
        let whereData = {
            id:reqUserid
        }
        const useridCheckResponse = await CommentClass.checkUserIdExists(attr, whereData)
        const useridCheck = useridCheckResponse.data
        if(useridCheck.length == 0){
            res.send(utils.sendResponse(false, "" ,TEXT.noUserExists))
        }
    } catch (error) {
        res.send(utils.sendResponse(false, "", error))
    }

    try {
        let createData = {uid: reqUserid, tweet: reqTweet}
        const newTweetResponse = await tweetClass.createTweet(createData)
        const newTweet = newTweetResponse.data
        res.send(utils.sendResponse(true, newTweet, ""))
    } catch (error) {
        res.send(utils.sendResponse(false, "", error))
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
        return res.send(utils.classResponse(false, "", TEXT.noUserId))
    }
    let whereData = {
        uid:reqUserid
    }
    let orderData = [
        ['createdAt', 'DESC']
    ]
    try {
        let tweetsResponse = await tweetClass.readTweet(whereData, orderData)
        let tweets = tweetsResponse.data
        res.send(utils.sendResponse(true, tweets, ""))
    } catch (error) {
        res.send(utils.sendResponse(false, "", error))
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
    let reqTweet = parseInt(req.body.tweet)
    let errors = tweetFunction.emptyFieldUpdateTweet(reqId, reqUserid, reqTweet)
    if(errors.length){
        return res.send(utils.sendResponse(false, "", errors.join(",")))
    }
    let updateData = {tweet : reqTweet}
    let whereData = {
        id: reqId,
        uid: reqUserid
    }
    try {
        let updateTweetResponse = await tweetClass.updateTweet(updateData, whereData)
        let updateTweet = updateTweetResponse.data
        res.send(utils.sendResponse(true, updateTweet, ""))
    } catch (error) {
        res.send(utils.sendResponse(false, "", error))
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
            return res.send(utils.sendResponse(false, "", TEXT.noPageNo + TEXT.noTweetId))
        }
        pageno = pageno-1;
        const pageSize = constant.limitTweets;
        let offsetValue = (pageno*pageSize);
        let whereData = {
            id:{
                [Op.eq] : tweetid
            }
        }
        let includeData = [
            {
                model:commentdb, as:"comments",
                include : [
                    {
                        model:userdb, as:"user",
                        attributes:['id', 'name']
                    }
                ]
            }
        ]
        let orderData = [
            ['createdAt', 'DESC']
        ]

        const rowsRecordResponse = await tweetClass.allTweetCommentsWithUser(whereData, includeData, orderData, offsetValue)
        const rowsRecord = rowsRecordResponse.data
        res.send(utils.sendResponse(true, rowsRecord, ""))
    } catch (error) {
        res.send(utils.sendResponse(false, "", error))
    }
}
