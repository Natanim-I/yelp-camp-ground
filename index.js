if(process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}

const express = require("express")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const session = require("express-session")
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet")
const passport = require("passport")
const localStrategy = require("passport-local")
const ExpressError = require("./utils/expresserror.js")
const campgroundRouter = require("./routes/campgrounds.js")
const reviewRouter = require("./routes/reviews.js")
const authRouter = require("./routes/auth.js")
const User = require("./models/user.js")
const dbconfig = require("./configuration/dbconfig.js")

const app = express()

app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "public")))
app.use(mongoSanitize())

const store = MongoStore.create({ 
    mongoUrl: 'mongodb://localhost:27017/yelp',
    secret: "YelpCampgroundSecret",
    touchAfter: 24 * 3600
})
const sessionConfig = {
    store,
    name: "session",
    secret: "YelpCampgroundSecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expres: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net",
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/diornu3yv/",  
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currentUser = req.user
    next()
})

app.use("/", authRouter)
app.use("/campgrounds", campgroundRouter)
app.use("/campgrounds/:id/reviews", reviewRouter)

app.get("/", (req, res) => {
    res.render("home")
})

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found!", 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if(!err.message) err.message = "Error, Something Went Wrong!!!"
    res.status(statusCode).render("error", { err })
})

app.listen(process.env.PORT, () => {
    console.log(`Server started listening on port: ${process.env.PORT}`)
})
