const TEXT = require("../../text").TEXT

/**
 * Check if search field is empty or not
 * @param {String} email 
 * @param {Integer} uid
 */
exports.emptySearchField = (email, uid) => {
    let errors = []
    if (!email) {
        errors.push(TEXT.noEmail)
    }
    if (!uid) {
        errors.push(TEXT.noUserId)
    }
    return errors
}

/**
 * check if email or password field is empty or not
 * @param {String} email 
 * @param {String} password 
 */
exports.emptyLoginField = (email, password) => {
    let errors = []
    if (!password) {
        errors.push(TEXT.noPassword)
    }
    if (!email) {
        errors.push(TEXT.noEmail)
    }
    return errors
}

/**
 * Checks all signup fields
 * @param {String} name 
 * @param {String} email 
 * @param {String} password 
 */
exports.emptySignupField = (name, email, password) => {
    let errors = []
    if (!name) {
        errors.push(TEXT.noName)
    }
    if (!password) {
        errors.push(TEXT.noPassword)
    }
    if (!email) {
        errors.push(TEXT.noEmail)
    }
    return errors
}

/**
 * Check if userid, name , password field is empty or not
 * @param {Integer} uid 
 * @param {String} name 
 * @param {String} password 
 */
exports.emptyUpdateName = (uid, name, password) => {
    let errors = []
    if (!uid) {
        errors.push(TEXT.noUserId)
    }
    if (!name) {
        errors.push(TEXT.noName)
    }
    if (!password) {
        errors.push(TEXT.noPassword)
    }
    return errors
}

/**
 * 
 * @param {Integer} uid 
 * @param {String} password 
 * @param {String} newpassword 
 */
exports.emptyUpdatePassword = (uid, password, newpassword) => {
    let errors = []
    if (!uid) {
        errors.push(TEXT.noUserId)
    }
    if (!password) {
        errors.push(TEXT.noPassword)
    }
    if (!newpassword) {
        errors.push(TEXT.noNewPassword)
    }
    return errors
}

/**
 * 
 * @param {Integer} pageno 
 * @param {Integer} pageSize 
 * @param {Integer} userid 
 */
exports.emptyusersAllTweets = (pageno, pageSize, userid) => {
    let errors = []
    if (!pageno) {
        errors.push(TEXT.noPageNo)
    }
    if (!pageSize) {
        errors.push(TEXT.noPageSize)
    }
    if (!userid) {
        errors.push(TEXT.noUserId)
    }
    return errors
}