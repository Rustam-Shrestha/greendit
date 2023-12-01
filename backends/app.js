const express = require("express");
const app = express();
require("dotenv").config()
require("../model/index")

app.get("/",()=>{
    console.log("alive")
})

const PORT = process.env.PORT ||4000
app.listen(PORT, ()=>{
    console.log(`server started at https://localhost:${PORT}`)
})