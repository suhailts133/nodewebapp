const { ConnectionStates } = require("mongoose");
const User = require("../../models/userSchema.js")
const nodemailer = require("nodemailer")
const env = require("dotenv").config();
const bcrypt = require("bcrypt")

const loadHomePage = async (req, res) => {
    try {
        const user = req.session.user;
        if(user){
            const userData = await User.findOne({email:user})
            console.log(userData)
            return res.render("home", {user:userData});
        }else{
            return res.render("home");
        }
    } catch (error) {
        console.log("Home page not found", error.message)
        res.status(500).send("server error")
    }
}

const pageNotFound = async (req, res) => {
    try {
        res.render("page-404")
    } catch (error) {
        res.redirect("/pageNotFound")
    }
}


const loadSignup = async (req, res) => {
    try {
        return res.render('signup')
    } catch (error) {
        console.log("Sign up page loading error", error.message);
        res.status(500).send("Server error")
    }
}

function generateOtp(){
    return Math.floor(100000 + Math.random() * 900000).toString();
}
async function sendVerificationEmail(email, otp) {
    try {
        const transporter = nodemailer.createTransport({
            service:"gmail",
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:process.env.NODEMAILER_EMAIL,
                pass:process.env.NODEMAILER_PASSWORD
            }
        })
        const info = await transporter.sendMail({
            from:process.env.NODEMAILER_EMAIL,
            to:email,
            subject:"verify your account",
            text:`Your OTP is ${otp}`,
            html: `<b>Your OTP: ${otp}</b>`
        })
        return info.accepted.length > 0;
    } catch (error) {
        console.error("error sending email", error);
        return false
    }
}

const signup = async (req, res) => {
    try {
        const {name,phone, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            console.log("Passwords do not match");
            return res.render("signup", { message: "Passwords do not match" });
        }

        const findUser = await User.findOne({ email });
        console.log("Find user result:", findUser);

        if (findUser) {
            console.log("User already exists");
            return res.render("signup", { message: "This email already exists" });
        }

        const otp = generateOtp();
    

        const emailSent = await sendVerificationEmail(email, otp);
        console.log("Email sent status:", emailSent);

        if (!emailSent) {
            return res.json("email-error");
        }

        req.session.userOtp = otp;
        req.session.userData = {name, phone, email, password };
    

        res.render("otp");
        console.log("otp sent", otp)
    } catch (error) {
        console.error("Error in signup function:", error.message);
        res.redirect("/pageNotFound");
    }
};

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log("error while hashing password ", error.message)
    }
}

const verifyOtp = async (req, res) => {
    try {
        const {otp} = req.body;
        console.log(otp);
        if(otp === req.session.userOtp){
            const user = req.session.userData;
            const passwordHash = await securePassword(user.password);
            const saveUserData = new User({
                name:user.name,
                email:user.email,
                phone:user.phone,
                password:passwordHash,
                googleId:null
            })
            await saveUserData.save();
            req.session.user = saveUserData._id;
            res.json({success:true, redirectUrl:"/login"})
        }else{
            res.status(400).json({success:false, message:"Invalid OTP, please try again"})
        }
    } catch (error) {
        console.error("error while verifying otp", error.message);
        res.status(500).json({success:false, message:"An error occured"})   
    }
}


const resendOtp = async (req, res) => {
    try {
        const {email} = req.session.userData;
        if(!email){
            return res.status(400).json({success:false, message:"Email not found in session"})
        }
        const otp = generateOtp();
        req.session.userOtp = otp;
        const emailSent = await sendVerificationEmail(email, otp);
        if(emailSent){
            console.log("Resend otp", otp);
            res.status(200).json({success:true, message:"OTP Resend Successfully"})
        }else{
            res.status(500).json({success:false, message:"Failed to resend OTP. Please try again"})
        }
    } catch (error) {
        consle.error("Error resending  OTP",error.message);
        res.status(500).json({success:false, message:"server error pleae try again"})
    }
}

const loadLogin = async (req, res) => {
     try {
        if(!req.session.user){
            return res.render("login")
        }else{
            res.redirect("/")
        }
     } catch (error) {
        res.redirect("pageNotFound")
        console.error("error while loadin login page", error.message)
     }
}


const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const findUser = await User.findOne({email:email});
        if(!findUser){
            return res.render("login", {message:"user not found"})
        } 
        if(findUser.isBlocked){
            return res.render("login", {message:"user is blocked by admin"})
        }
        const passwordMatch = await bcrypt.compare(password, findUser.password);
        if(!passwordMatch){
            return res.render("login", {message:"Incorrect password"});
        }
        req.session.user = findUser.email;
        console.log(req.session.user)
        res.redirect("/")
    } catch (error) {
        console.error("error while  loging in the user ",error.message);
        res.render("login", {message:"login failed please try again later"})
    }
}


const logOut = async (req, res) => {
    try {
        req.session.destroy((error) => {
            if(error){
                console.log("session destruction error",error);
                return res.redirect("/pageNotFound")
            }else {
                return res.redirect("/login")
            }
        })
    } catch (error) {
        console.error("error while logging out",error.message)
    }
}

module.exports = {
   loadHomePage, 
   pageNotFound,
   loadSignup,
   signup,
   verifyOtp,
   resendOtp,
   loadLogin,
   login,
   logOut
}