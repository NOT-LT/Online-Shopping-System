const express = require('express');
const router = express.Router({mergeParams: true}); // enabling req.params because the endpoint is not in this file
const asyncHandler = require('../utils/asyncHandler')
const {validateReview, isLoggedIn, isAdmin} = require('../middleware');
const {createReview ,getReviews, deleteReview} = require('../controllers/reviewController');


router.route('/')
  .get(asyncHandler(getReviews))
  .post(isLoggedIn, validateReview, asyncHandler(createReview))

  router.route('/:reviewId')
  .delete(isLoggedIn, isAdmin, asyncHandler(deleteReview))
module.exports = router;