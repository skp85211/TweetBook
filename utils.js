/**
 * Sends response
 * @param {Boolean} success 
 * @param {Object} data 
 * @param {String} err 
 */
const classResponse = (success, data, err) => {
    let dataResponse = jsonParse(data)
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
const sendResponse = (res, success, data, err) => {
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
const jsonParse = (data) => {
    return JSON.parse(JSON.stringify(data))
}

/**
 * Check if numbers (integers) are NaN or not
 * @param  {...Integers} integers 
 * @returns 
 */
const isNumberNaN = (...integers) =>{
    for(i = 0; i<integers.length; i++){
        if(isNaN(integers[i])){
            return true
        }
    }
    return false
}

module.exports = { classResponse, sendResponse, jsonParse, isNumberNaN }