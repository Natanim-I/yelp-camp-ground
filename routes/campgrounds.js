const express = require("express")
const router = express.Router()
const Campground = require("../models/campground")
const catchAsync = require("../utils/wrapasync")
const { isLoggedIn, isAuthor, validateCampground } = require("../middlewares.js")

router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index", {campgrounds})
}))

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new")
})

router.post("/", isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id
    await campground.save()
    req.flash("success", "Campground successfully created!")
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get("/:id", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author")
    if(!campground){
        req.flash("error", "Can not find that campground!")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/show", {campground}) 
}))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        req.flash("error", "Can not find that campground!")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit", {campground}) 
}))

router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params
    const updatedCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, {runValidators: true})
    req.flash("success", "Campground successfully updated!")
    res.redirect(`/campgrounds/${updatedCampground._id}`)
}))

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground successfully deleted!")
    res.redirect("/campgrounds")
}))

module.exports = router