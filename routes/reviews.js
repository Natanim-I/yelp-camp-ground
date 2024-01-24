const express = require("express")
const router = express.Router({ mergeParams: true})
const catchAsync = require("../utils/wrapasync")
const { isLoggedIn, validateReview } = require("../middlewares")
const { postReview, deleteReview } = require("../controllers/review")

router.post("/", isLoggedIn, validateReview, catchAsync(postReview))
router.delete("/:reviewId", isLoggedIn, catchAsync(deleteReview))

module.exports = router