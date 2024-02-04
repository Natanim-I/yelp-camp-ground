const express = require("express")
const router = express.Router()
const catchAsync = require("../utils/wrapasync")
const passport = require("passport")
const users = require("../controllers/auth")

router.route("/register")
    .get(users.register)
    .post(catchAsync(users.registerUser))
    
router.route("/login")
    .get(users.showLogin)
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login"}), users.login)

router.get("/logout", users.logout)

module.exports = router