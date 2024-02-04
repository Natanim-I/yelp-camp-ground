const { cloudinary } = require("../configuration/cloudinaryconfig")
const Campground = require("../models/campground")
const mpxGoeCoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mpxToken = process.env.MAPBOX_TOKEN
const geocoder = mpxGoeCoding({accessToken: mpxToken})

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index", {campgrounds})
}

module.exports.newCampground = (req, res) => {
    res.render("campgrounds/new")
}

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground)
    campground.geometry = geoData.body.features[0].geometry
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.author = req.user._id
    await campground.save()
    req.flash("success", "Campground successfully created!")
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
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
}

module.exports.searchCampgrounds = async (req, res) => {
    const { search } = req.body
    const campgrounds = await Campground.find({title: search})
    res.render("campgrounds/index", {campgrounds})
}

module.exports.editCamp = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        req.flash("error", "Can not find that campground!")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit", {campground}) 
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params
    const updatedCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, {runValidators: true})
    const images = req.files.map(f => ({url: f.path, filename: f.filename}))
    updatedCampground.images.push(...images)
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await updatedCampground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    await updatedCampground.save()
    req.flash("success", "Campground successfully updated!")
    res.redirect(`/campgrounds/${updatedCampground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground successfully deleted!")
    res.redirect("/campgrounds")
}