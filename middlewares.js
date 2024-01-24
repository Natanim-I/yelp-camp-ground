const Campground = require("./models/campground")
const ExpressError = require("./utils/expresserror")
const { campgroundSchema, reviewSchema } = require("./schemas")

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash("error", "You must be signed in first!")
        return res.redirect(`/login?_redirect=${req.originalUrl}`)
    }
    next()
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if(error){
        const errorMsg = error.details.map(el => el.message).join(",")
        throw new ExpressError(errorMsg, 400)
    } else{
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if(error){
        const errorMsg = error.details.map(el => el.message).join(",")
        throw new ExpressError(errorMsg, 400)
    } else{
        next()
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash("error", "You don't have permission!!!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}
