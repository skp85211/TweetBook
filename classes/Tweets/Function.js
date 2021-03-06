const TEXT = require("../../text").TEXT

/**
 * check user id, tweet fields are empty or not
 * @param {Integer} uid 
 * @param {String} tweet 
 */
const emptyFieldCreateTweet = (uid, tweet) => {
    let errors = []
    if (!uid || isNaN(uid)) {
        errors.push(TEXT.noUserId)
    }
    if (!tweet) {
        errors.push(TEXT.noTweet)
    }
    return errors
}

/**
 * check id, uid, tweet are empty or not
 * @param {Integer} id 
 * @param {Integer} uid 
 * @param {String} tweet 
 * @returns 
 */
const emptyFieldUpdateTweet = (id, uid, tweet) => {
    let errors = []
    if (!id || isNaN(id)) {
        errors.push(TEXT.noID)
    }
    if (!uid || isNaN(uid)) {
        errors.push(TEXT.noUserId)
    }
    if (!tweet) {
        errors.push(TEXT.noTweet)
    }
    return errors
}

module.exports = { emptyFieldCreateTweet, emptyFieldUpdateTweet }