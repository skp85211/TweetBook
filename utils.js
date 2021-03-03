//success, data, error

/**
 * Sends response from class function to controller
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
 * Sends response to request from controller
 * @param {Boolena} success 
 * @param {Object} data 
 * @param {String} err 
 */
exports.sendResponse = (success, data, err) => {
    let response = JSON.stringify({
        "success": success,
        "data": data,
        "error": err
    })
    return response
}

/**
 * Parse JSON
 * @param {Object} data 
 */
exports.jsonParse = (data) => {
    return JSON.parse(JSON.stringify(data))
}