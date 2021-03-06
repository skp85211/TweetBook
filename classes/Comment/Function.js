const TEXT = require("../../text").TEXT

/**
 * Checks tweetid, userid, comment fields are empty or not
 * @param {Integer} tid 
 * @param {Integer} uid 
 * @param {TEXT} comment 
 */
const emptyFieldCreateComment = (tid, uid, comment) => {
    let errors = []
    if (!tid) {
        errors.push(TEXT.noTid)
    }
    if (!uid) {
        errors.push(TEXT.noUid)
    }
    if (!comment) {
        errors.push(TEXT.noComment)
    }
    return errors
}

module.exports = { emptyFieldCreateComment }