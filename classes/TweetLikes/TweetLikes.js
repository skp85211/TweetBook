const likes = require("../../model/Likes")
const utils = require("../../utils")
const { ERRORS } = require("../../errorConstants")

/**
 * Insert data of user who liked the tweet
 * @param {Object} createData 
 */
exports.createLike = async (createData) => {
    const createLike = await likes.create(createData)
    return utils.classResponse(true, createLike, "")
}

/**
 * Reads and checks if user liked this tweet or not
 * @param {Object} whereData 
 */
exports.readLike = async (whereData) => {
    const readLike = await likes.findAll({
        where: whereData
    })
    if (readLike.length == 0) {
        return utils.classResponse(false, "", ERRORS.noLikeByUser)
    }
    return utils.classResponse(true, readLike, "")
}

/**
 * Dislike tweet or deletes entry from likes table when user dislike the tweet
 * @param {Object} whereData 
 */
exports.deleteLike = async (whereData) => {
    const deleteLike = await likes.destroy({
        where: whereData
    })
    return utils.classResponse(true, deleteLike, "")
}

/**
 * All user who liked this tweet
 * @param {Object} whereData 
 * @param {Array} includeData 
 */
exports.whoAllLikedTweet = async (whereData, includeData) => {
    const usersList = await likes.findAll({
        where: whereData,
        include: includeData
    })
    return utils.classResponse(true, usersList, "")
}