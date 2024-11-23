const mongoose = require('mongoose')
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  title: {
    type: String
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  fullName: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  rating: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Review = mongoose.model('Review', ReviewSchema)

module.exports = Review;