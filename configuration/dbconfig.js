const mongoose = require("mongoose")
const dbUrl = "mongodb://localhost:27017/yelp"
//const dbUrl = process.env.MONGODB
mongoose.connect(dbUrl)
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error!"))
db.once("open", () => {
    console.log("Database Connected!")
})