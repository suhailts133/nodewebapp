const express = require("express");
const userController = require("../controllers/user/userController.js");
const passport = require("passport");
const router = express.Router();

router.get("/pageNotFound", userController.pageNotFound);
router.get("/", userController.loadHomePage)
router.get("/signup", userController.loadSignup)
router.post("/signup" ,userController.signup)
router.post("/verify-otp" ,userController.verifyOtp)
router.post("/resend-otp" ,userController.resendOtp)

router.get("/auth/google" ,passport.authenticate('google', {scope:["profile", "email"]}))
router.get("/auth/google/callback", passport.authenticate('google', {failureRedirect:"/signup"}), (req, res) => {
    res.redirect("/");
})

router.get("/login", userController.loadLogin)
router.post("/login", userController.login)
router.get("/logout", userController.logOut)
// router.get("/shop", userController.loadShopping)




module.exports = router;