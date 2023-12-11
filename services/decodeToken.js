const jwt = require("jsonwebtoken")
// const promisify = require("util").promisify
// promisify will handle all the callbacks and fire up promises
const {promisify} = require("util")

// passing token got and secret embedded
exports.decodeToken = async (token,secret)=>{
    //verifying tokens with secret
    const decryptedResult = await promisify(jwt.verify)(token,secret)
    return decryptedResult
}