// ========all imports and configurations=========
//================================================
const express = require("express");
const app = express();
const passport = require("passport")
const { users } = require("./model/index")
const cookieParser= require("cookie-parser")
require("dotenv").config()
require("./model/index")

//requiring router that we have made in routes/organizationRoute
const organizationRoute = require("./routes/organizationRoute")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
const generateToken = require("./services/generateToken");
const { route } = require("./routes/organizationRoute");
// google login begins here
//holding user profile data
let userProfile;
//requiring oauth strategy
let GoogleStrategy = require("passport-google-oauth").OAuth2Strategy

//middlewares
//this will make this thing available in every requiest
// seting up them for authentication
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// setting up view engine in ejs
app.set("view engine", "ejs")

//configure serialze and deserialize function
passport.serializeUser((user, cb) => {
    //serialize into a session
    //error and user sessionas argument
    cb(null, user)
})

//deserializing user
passport.deserializeUser((obj, cb) => {
    //deser9ialize from a function
    //error and user session
    cb(null, obj)
})

// serialization

// Serialization is the process of converting an object or data structure into a format that can be easily stored, transmitted, or reconstructed at a later time.This process involves converting the state of an object into a byte stream or a string format, which can then be stored in a file, sent over a network, or used for various purposes.

// deserialization

// the process of reconstructing the original object from the serialized data. It involves reading the serialized data and rebuilding the object with the same state and properties as it had before serialization.




// ========Endpoints and apis =========
//================================================
app.get("/", (req, res) => {
    res.render("home")
})

// ========passportjs and other configurations=========
//================================================
//configuring oauth strategy
passport.use(new GoogleStrategy({
    // getting client id given by google cloud
    clientID: process.env.CLIENT_ID,
    // getting client secret given by google cloud
    clientSecret: process.env.CLIENT_SECRET,
    // redirecting user to login callback function if success
    callbackURL: "http://localhost:3000/auth/google/callback"
},
    // callback function that will get access token from google login matches it refresh token and profile and function will log in user if credentials matches 
    (accessToken, refreshToken, profile, done) => {
        // data will be accessed from an array here
        userProfile = profile;
        // console.log(profile)
        // userprofile will be serialized and kept with serialize function above
        return done(null, userProfile)
    }
))

//get google user profile name and emeil 
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }))
//securng endpoint if someone directly goes to this path
app.get("/auth/google/callback", passport.authenticate("google", {
    failureRedirect: "http://localhost:3000"
}),
    // asynchronouusly find something in database 
    async (req, res) => {
        try {

            const userGoogleEmail = userProfile.emails[0].value
            const user = await users.findOne({
                where: { email: userGoogleEmail }
            })
            if (user) {
                //authehnthicating user with their unique token setting that as cookie 3 days and redirecting user to the page
                //sign method takes user unique key, secret of user and expiry date as parameter

                const token = generateToken(user);
                res.cookie("token", token)
                res.redirect("/organization");
            } else {
                const user = await users.create({
                    email: userGoogleEmail,
                    googleId: userProfile.id,
                    userName: userProfile.displayName
                })
                // console.log(userProfile)
                const token = generateToken(user);
                res.cookie("token", token)
                res.redirect("/organization");
            }
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("An error occurred");
        }
    }
)
// google login ends here 
//use passport js 0.4 instead of new version bcs they are buggy


//
app.use("/", organizationRoute)


const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`server started at https://localhost:${PORT}`)
})



// console.log(userProfile)