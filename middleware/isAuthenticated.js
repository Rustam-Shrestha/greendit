//comparing user with their token if they  ae actually logged in from google

const jwt = require("jsonwebtoken")
// const promisify = require("util").promisify
//requiring user model
const { users } = require("../model")
const { decodeToken } = require("../services/decodeToken")

// custom function user authentication
exports.isAuthenticated = async (req,res,next)=>{
    // getting user kookie that we have kept in their browser 
    // it has json web tokenb
    const token = req.cookies.token

    //check if token given or not 
    // if not force user to go to login
    if(!token){
        return res.redirect("/login")
    }
    
    // verify token if it is legit or not
    // compare the token with secret key that we have encoded with that token available in our env variable
   const decryptedResult =  await decodeToken(token,process.env.SECRETKEY)
//    console.log(decryptedResult)

   // check if that id(userId) users table ma exist xa 
   //if token is found with the user id in our database then put them in this following variable
   const userExist = await users.findAll({
    where : {
        id : decryptedResult.id
    }
   })

   //check if length is zero or not(zero->userExist gardaina)
   //user is not found here
    if(userExist.length == 0){
        //this will say the wrong token message
        res.send("User with that token doesn't exist")
    }else{
        // if user exists with token then get it's id as primaryu key
        req.user =  userExist; // alternative decryptedResult.id
        req.userId = userExist[0].id 
      
        next();
    }
}