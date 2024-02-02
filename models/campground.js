const mongoose = require ("mongoose")
const Schema = mongoose.Schema
const Review = require("./reviews")

const options = {toJSON: {virtuals: true}}
const CampgroundSchema = new Schema({
    title: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, options)

CampgroundSchema.virtual("properties.popupMarkUp").get(function(){
    return `<strong><a href="/campgrounds/${this._id}" style="color: black; font-size: 20px;">${this.title}</a></strong>` 
})

CampgroundSchema.post("findOneAndDelete", async function(doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

const Campground = mongoose.model("Campground", CampgroundSchema)
module.exports = Campground