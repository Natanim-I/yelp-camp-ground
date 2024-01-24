const mongoose = require("mongoose")
const Campground = require("../models/campground.js")
const User = require("../models/user.js")
const cities = require("./cities.js")
const { descriptors, places } = require("./seedHelpers.js")

mongoose.connect("mongodb://localhost:27017/yelp")
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error!"))
db.once("open", () => {
    console.log("Database Connected!")
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    await User.deleteMany({})
    for(let i = 0; i < 30; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 1000) + 100
        const description = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat ab in blanditiis dignissimos omnis! Vel maxime totam iste nesciunt voluptatem hic et nemo distinctio, temporibus porro numquam dignissimos dolor alias!"
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:"https://source.unsplash.com/collection/429524",
            price: price,
            description: description
        })
        await camp.save()
    }
    console.log(await Campground.find({}))
}

seedDB().then(() => {
    mongoose.connection.close()
})