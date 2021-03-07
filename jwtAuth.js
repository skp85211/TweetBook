const jwt = require("jsonwebtoken")

const dotenv = require("dotenv")
dotenv.config()

/**
 * Generates JWT Token
 * @param {Integer} userid 
 */
exports.generateAccessToken = (userid) => {
    console.log("......")
    const token = jwt.sign(userid, process.env.TOKEN_SECRET)
    console.log(token, "JWT TOKEN generated")
    return token
}

/**
 * Authenticate JWT Token
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next 
 */
exports.authenticateToken = (req, res, next) => {
    let jwtToken = req.headers["access-token"]
    jwt.verify(jwtToken, process.env.TOKEN_SECRET, (err, decoded) => {
        if(err){
            console.log("Error : "+ err)
        }
        console.log(decoded)
        req.userid = decoded
    })
    next()
}