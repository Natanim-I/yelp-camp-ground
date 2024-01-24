const express = require("express")
const router = express.Router()
const catchAsync = require("../utils/wrapasync")
const { isLoggedIn, isAuthor, validateCampground } = require("../middlewares.js")
const campgrounds = require("../controllers/campgrounds.js")

router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

router.get("/new", isLoggedIn, campgrounds.newCampground)

router.route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.editCamp))

module.exports = router