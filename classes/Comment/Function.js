const TEXT = require("../../text").TEXT

/**
 * Checks tweetid, userid, comment fields are empty or not
 * @param {Integer} tid 
 * @param {Integer} uid 
 * @param {String} comment 
 * @returns 
 */
const emptyFieldCreateComment = (tid, uid, comment) => {
    let errors = []
    if (!tid || isNaN(tid)) {
        errors.push(TEXT.noTid)
    }
    if (!uid || isNaN(uid)) {
        errors.push(TEXT.noUid)
    }
    if (!comment) {
        errors.push(TEXT.noComment)
    }
    return errors
}

module.exports = { emptyFieldCreateComment }