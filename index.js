const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const Campground = require("./models/campground.js")
const PORT = 3000

mongoose.connect("mongodb://localhost:27017/yelp")
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error!"))
db.once("open", () => {
    console.log("Database Connected!")
})

const app = express()

app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride("_method"))

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index", {campgrounds})
})

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new")
})

app.get("/campgrounds/:id", async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/show", {campground}) 
})

app.post("/campgrounds", async (req, res) => {
    const { title, location } = req.body.campgrounds
    const campground = new Campground({
        title: title,
        location: location
    })
    console.log(campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get("/campgrounds/:id/edit", async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/edit", {campground}) 
})

app.put("/campgrounds/:id", async (req, res) => {
    const { id } = req.params
    const { title, location } = req.body.campgrounds
    const campground = {
        title: title,
        location: location
    }    
    const updatedCampground = await Campground.findByIdAndUpdate(id, campground, {runValidators: true})
    res.redirect(`/campgrounds/${updatedCampground._id}`)
})

app.delete("/campgrounds/:id", async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds")
})

app.listen(PORT, () => {
    console.log(`Server started listening on port: ${PORT}`)
})