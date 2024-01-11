const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const Campground = require("./models/campground.js")
const PORT = 3000

mongoose.connect("mongodb://localhost:27017/yelp")
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error!"))
db.once("open", () => {
    console.log("Database Connected!")
})

const app = express()

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({extended: true}))

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
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
})

app.listen(PORT, () => {
    console.log(`Server started listening on port: ${PORT}`)
})