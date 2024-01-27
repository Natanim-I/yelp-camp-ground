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
    for(let i = 0; i < 30; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 1000) + 100
        const description = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat ab in blanditiis dignissimos omnis! Vel maxime totam iste nesciunt voluptatem hic et nemo distinctio, temporibus porro numquam dignissimos dolor alias!"
        const camp = new Campground({
            author: "65b099ea8a3f079d53070c84",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: price,
            description: description,
            images: [
                {
                  url: 'https://res.cloudinary.com/diornu3yv/image/upload/v1706332376/Yelp%20Camp/vx59zk7plce3ooieb2dn.jpg',
                  filename: 'Yelp Camp/vx59zk7plce3ooieb2dn',
                },
                {
                  url: 'https://res.cloudinary.com/diornu3yv/image/upload/v1706332379/Yelp%20Camp/ijk0vckmstudr1te2ckn.jpg',
                  filename: 'Yelp Camp/ijk0vckmstudr1te2ckn',
                },
                {
                  url: 'https://res.cloudinary.com/diornu3yv/image/upload/v1706332378/Yelp%20Camp/z9j8e6hmnk6cdpxccfkc.jpg',
                  filename: 'Yelp Camp/z9j8e6hmnk6cdpxccfkc',
                }
              ]
        })
        await camp.save()
    }
    console.log(await Campground.find({}))
}

seedDB().then(() => {
    mongoose.connection.close()
})