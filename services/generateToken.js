const jwt=require("jsonwebtoken")
const generateToken = (user)=>{
    return jwt.sign({ id: user.id }, process.env.SECRETKEY, {
        expiresIn: '3d'
    })
}
module.exports = generateToken