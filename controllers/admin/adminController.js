const mongoose = require("mongoose");
const User = require("../../models/userSchema.js")
const env = require("dotenv").config();
const bcrypt = require("bcrypt")


const pageError = async (req,res) => {
    res.render("admin-error")
}


const loadLogin = async (req, res) => {
    if(req.session.admin){
        return res.redirect("/admin/dashboard")
    }
    res.render("admin-login", {message:null})
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await User.findOne({ email, isAdmin: true });

        if (admin) {
        
            const passwordMatch = await bcrypt.compare(password, admin.password);

            if (passwordMatch) {
                req.session.admin = true;
                
                return res.redirect("/admin/dashboard"); // Redirect to the correct admin dashboard
            } else {
                return res.render("admin-login", { message: "Invalid credentials" }); // Show an error message
            }
        } else {
            return res.render("admin-login", { message: "Admin not found" }); // Show an error message
        }
    } catch (error) {
        console.log("Error while logging in admin:", error.message);
        return res.redirect("/pagerror");
    }
};


const loadDashboard = async (req, res) => {
    if(req.session.admin){
        try {
            res.render("dashboard")
        } catch (error) {
            res.redirect("/pagerror")
        }
    }
}

const logout = async (req, res) => {
    try {
        req.session.destroy(error => {
            if(error){
                console.log("error while destroying session in admin side",error);
                return res.redirect("/pageerror")
            }
            res.redirect("/admin/login")
        })
    } catch (error) {
        console.log("unexpected error while logging out admin",error)
        res.redirect("/pageerror")
    }
}

module.exports = {
    loadLogin,
    login,
    loadDashboard,
    pageError,
    logout
}