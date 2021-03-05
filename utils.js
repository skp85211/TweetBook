/**
 * Sends response
 * @param {Boolean} success 
 * @param {Object} data 
 * @param {String} err 
 */
exports.classResponse = (success, data, err) => {
    let dataResponse = this.jsonParse(data)
    return {
        "success": success,
        "data": dataResponse,
        "error": err
    }
}

/**
 * Sends response to request 
 * @param {Boolena} success 
 * @param {Object} data 
 * @param {String} err 
 */
exports.sendResponse = (res, success, data, err) => {
    return res.send(JSON.stringify({
        "success": success,
        "data": data,
        "error": err
    })
    )
}

/**
 * Parse JSON
 * @param {Object} data 
 */
exports.jsonParse = (data) => {
    return JSON.parse(JSON.stringify(data))
}