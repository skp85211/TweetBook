const Friendship = require("../Friendship/Friendship")

const TEXT = require("../../text").TEXT

/**
 * Check if search field is empty or not
 * @param {String} email 
 * @param {Integer} uid
 * @returns 
 */
const emptySearchField = (email, uid) => {
    let errors = []
    if (!email) {
        errors.push(TEXT.noEmail)
    }
    if (!uid || isNaN(uid)) {
        errors.push(TEXT.noUserId)
    }
    return errors
}

/**
 * check if email or password field is empty or not
 * @param {String} email 
 * @param {String} password 
 * @returns 
 */
const emptyLoginField = (email, password) => {
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
 * @returns  
 */
const emptySignupField = (name, email, password) => {
    let nameRegex = /^[a-zA-Z\s]+$/;
    let phoneRegex = /^[7-9][0-9]{9}$/;
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let errors = []
    if ((!name) || (nameRegex.test(name) === false)) {
        errors.push(TEXT.noName)
    }
    if (!password) {
        errors.push(TEXT.noPassword)
    }
    if ((!email) || ((emailRegex.test(email) === false) && (phoneRegex.test(email) === false))) {
        errors.push(TEXT.noEmail)
    }
    return errors
}

/**
 * Check if userid, name , password field is empty or not
 * @param {Integer} uid 
 * @param {String} name 
 * @param {String} password 
 * @returns 
 */
const emptyUpdateName = (uid, name, password) => {
    let errors = []
    if (!uid || isNaN(uid)) {
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
 * @returns 
 */
const emptyUpdatePassword = (uid, password, newpassword) => {
    let errors = []
    if (!uid || isNaN(uid)) {
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
 * check pageSize and userid if empty or not
 * @param {Integer} pageno 
 * @param {Integer} pageSize 
 * @param {Integer} userid 
 * @returns 
 */
const emptyusersAllTweets = (pageno, pageSize, userid) => {
    let errors = []
    if (!pageno || isNaN(pageno)) {
        errors.push(TEXT.noPageNo)
    }
    if (!pageSize || isNaN(pageSize)) {
        errors.push(TEXT.noPageSize)
    }
    if (!userid || isNaN(userid)) {
        errors.push(TEXT.noUserId)
    }
    return errors
}

/**
 * Search users friendship status with all user search array and return object with relation status
 * @param {Array} userSearchArray 
 * @param {Integer} reqUserid 
 * @returns 
 */
const userSearch = async (userSearchArray, reqUserid) => {
    for (const userSearch of userSearchArray) {
        const searchid = userSearch.id
        const searchEmail = userSearch.email
        const searchName = userSearch.name
        let userid1 = reqUserid
        let userid2 = searchid
        if (userid1 > userid2) {
            let temp = userid1
            userid1 = userid2
            userid2 = temp
        }
        const userRelationSearchResponse = await Friendship.friendshipCheck(userid1, userid2)
        const userRelationSearch = userRelationSearchResponse.data
        if (userRelationSearch.length == 0) {
            userSearch["friends"] = {
                relationStatus: false,
                id: searchid,
                name: searchName,
                email: searchEmail,
            }
        }
        else {
            userSearch["friends"] = {
                relationStatus: true,
                status: true,
                id: searchid,
                name: searchName,
                email: searchEmail,
                message: TEXT.InRelation,
                data: userRelationSearch[0]
            }
        }
    }
    return userSearchArray
}

module.exports = { emptySearchField, emptyLoginField, emptySignupField, emptyUpdateName, emptyUpdateName, emptyUpdatePassword, emptyusersAllTweets, userSearch }