const express = require('express');
const Item = require('../mongooseModels/item');
const Review = require('../mongooseModels/review');

module.exports.createReview = async (req, res) => {
  const item = await Item.findById(req.params.id);
  const review = new Review(req.body.review)
  console.log("review:" + req.body.review);
  if(req.isAuthenticated()){
    review.author = req.user._id;
    review.fullName = req.user.fullName;
    review.email = req.user.email;
    review.phoneNumber = req.user.phoneNumber;
  }
  item.reviews.push(review);
  await review.save();
  await item.save();
  res.status(200).send({ status: 'OK' });
}

module.exports.getReviews = async (req, res) => {
  const {id} = req.params;
  const item = await Item.findById(id);
  // await item.populate('reviews');
  res.send(item.reviews)
}

module.exports.deleteReview = async (req, res) => {
  const {id, reviewId} = req.params;
  await Item.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  return res.redirect(`/items/${id}`);
}