const User = require("../models/user")

module.exports.register = (req, res) => {
    res.render("users/register")
}

module.registerUser = async (req, res) => {
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
}

module.exports.showLogin = (req, res) => {
    const { _redirect } = req.query
    res.render("users/login", { _redirect })
}

module.exports.login = async (req, res) => {
    const { _redirect } = req.query
    req.flash("success", "Welcome to YelpCamp")
    const redirectUrl = _redirect || "/campgrounds"
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if(err){
            return next(err)
        }
        req.flash("success", "Logged Out!")
        res.redirect("/campgrounds") 
    })
}