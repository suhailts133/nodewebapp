const User = require("../models/userSchema.js")

const userAuth = (req, res, next) => {
    if(req.session.user){
        User.findOne({email:req.session.user})
        .then(data => {
            if(data && !data.isBlocked){
                next();
            }else{
                res.redirect("/login")
            }
        })
        .catch(error => {
            console.log("error in user authmiddleware",error)
            res.status(500).send("internal server error")
        })
    }else{
        res.redirect("/login")
    }
}
const adminAuth = (req, res, next) => {
   User.findOne({isAdmin:true})
   .then(data => {
    if(data){
        next()
    }else{
        res.redirect("/admin/login")
    }
   })
   .catch(error => {
    console.log("error in admin auth middelware", error)
    res.status(500).send("internal server error")
   })
}

module.exports = {
    adminAuth,
    userAuth
}