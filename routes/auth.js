const express = require("express")
const router = express.Router()
const catchAsync = require("../utils/wrapasync")
const User = require("../models/user")
const passport = require("passport")

router.get("/register", (req, res) => {
    res.render("users/register")
})

router.post("/register", catchAsync(async (req, res) => {
    try{
        const { username, email, password } = req.body
        const user = new User({ username, email})
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, (err) => {
            if(err) return next(err)
            req.flash("success", "Welcome to YelpCamp!")
            res.redirect("/campgrounds")
        }) 
    } catch(error){
        console.log(error)
        req.flash("error", error.message)
        res.redirect("/register")
    }
}))

router.get("/login", (req, res) => {
    const { _redirect } = req.query
    res.render("users/login", { _redirect })
})

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login"}), async (req, res) => {
    const { _redirect } = req.query
    req.flash("success", "Welcome to YelpCamp")
    const redirectUrl = _redirect || "/campgrounds"
    res.redirect(redirectUrl)
})

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if(err){
            return next(err)
        }
        req.flash("success", "Logged Out!")
        res.redirect("/campgrounds") 
    })
})

module.exports = router