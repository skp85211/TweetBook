const jwt = require("jsonwebtoken")

// const key = require('crypto').randomBytes(64).toString('hex')
// console.log(key, "KEY")
//  const TOKEN_SECRET = "f4cb99d9b7d9822def93af4837e00a2b3205ff5c51a418467ae9d278bff56281ed23cf91369ef4ebd27a9bd862b587b3ca7e47c4a15dc8c9eb1e000b36e4b0be"

const dotenv = require("dotenv")
dotenv.config()

exports.generateAccessToken = (userid) => {
    console.log("......")
    const token = jwt.sign(userid, process.env.TOKEN_SECRET)
    console.log(token, "JWT TOKEN generated")
    return token
}

exports.authenticateToken = (req, res, next) => {
    let jwtToken = req.headers["access-token"]
    jwt.verify(jwtToken, process.env.TOKEN_SECRET, (err, decoded) => {
        if(err){
            console.log("Error : "+ err)
        }
        console.log(decoded)
        req.body.userid = decoded
    })
    next()
}