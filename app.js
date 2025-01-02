// external libararies and modules
const express = require('express')
const env = require('dotenv').config();
const path = require("path") 

const app = express();
// custom and other files
const db = require("./config/db.js")
const userRouter = require("./routes/userRouter.js")
db() // database connection

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use("/",userRouter);


// settings
app.set("view engine", "ejs");
app.set("views",[path.join(__dirname, "views/user"), path.join(__dirname, "views/")]);



app.listen(process.env.PORT, () => console.log("server is running"));

module.exports = app;