// external libararies and modules
const express = require('express')
const env = require('dotenv').config();
const path = require("path") 
const session = require("express-session")
const passport = require("./config/passport.js")
const app = express();
const nocache = require("nocache");

// custom and other files
const db = require("./config/db.js")
const userRouter = require("./routes/userRouter.js")
const adminRouter = require("./routes/adminRouter.js")
db() // database connection

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        secure:false,
        httpOnly:true,
        maxAge:72*60*60*1000 
    }
}))
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});
app.use(nocache())
app.use(passport.initialize());
app.use(passport.session())




// user router
app.use("/", userRouter);
app.use("/admin",adminRouter);


// settings
app.set("view engine", "ejs");
app.set("views",[path.join(__dirname, "views/user"), path.join(__dirname, "views/admin")]);



app.listen(process.env.PORT, () => console.log("server is running"));

module.exports = app;