const Constant = require("./constant")
const TEXT = require("../../text").TEXT

/**
 * Takes All types of likes details and count different types of likes 
 * and return object of all types of likes with it's comment
 * @param {Array} likesArray 
 * @returns {Object} 
 */
const countDiffLikes = (likesArray) => {
    let likeCountObject = {
        likeTypeLikeCount: Constant.initialCount,
        likeTypeLoveCount: Constant.initialCount,
        likeTypeHappyCount: Constant.initialCount,
        likeTypeSadCount: Constant.initialCount,
        likeTypeCuriousCount: Constant.initialCount
    }
    for (dataItems of likesArray) {
        switch (dataItems.like_type) {
            case (TEXT.likeTypeLike):
                likeCountObject.likeTypeLikeCount += 1;
                break;
            case (TEXT.likeTypeLove):
                likeCountObject.likeTypeLoveCount += 1;
                break;
            case (TEXT.likeTypeHappy):
                likeCountObject.likeTypeHappyCount += 1;
                break;
            case (TEXT.likeTypeSad):
                likeCountObject.likeTypeHappyCount += 1;
                break;
            case (TEXT.likeTypeCurious):
                likeCountObject.likeTypeCuriousCount += 1;
                break;
        }
    }
    return likeCountObject;
}

module.exports = { countDiffLikes }