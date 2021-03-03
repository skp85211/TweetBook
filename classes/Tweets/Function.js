const TEXT = require("../../text").TEXT

/**
 * check user id, tweet fields are empty or not
 * @param {Integer} uid 
 * @param {String} tweet 
 */
exports.emptyFieldCreateTweet = (uid, tweet) => {
    let errors = []
    if (!uid) {
        errors.push(TEXT.noUserId)
    }
    if (!tweet) {
        errors.push(TEXT.noTweet)
    }
    return errors
}

exports.emptyFieldUpdateTweet = (id, uid, tweet) => {
    let errors = []
    if (!id) {
        errors.push(TEXT.noID)
    }
    if (!uid) {
        errors.push(TEXT.noUserId)
    }
    if (!tweet) {
        errors.push(TEXT.noTweet)
    }
    return errors
}