const Joi = require('joi');
const Review = require('./mongooseModels/review');


module.exports.itemValidationSchema = Joi.object({
  deletedImgs: Joi.string().allow('').optional(), // this is for the images that the user wants to delete
  item: Joi.object({
    title: Joi.string().required(),
    itemCategory: Joi.string().valid('Electronics', 'Clothing', 'Furniture', 'Books', 'Games').required(),
    price: Joi.string().required(),
    images: Joi.string().optional(),
    description: Joi.string().optional(),
    postDate: Joi.date().default(Date.now).optional(),
    reviews: Joi.array().optional(),
    views: Joi.number().default(0).optional(),
    colors: Joi.array().optional(),
    quantity: Joi.number().required(),
    sizes: Joi.array().optional(),
    width: Joi.number().optional(),
    height: Joi.number().optional(),
    depth: Joi.number().optional(),
    weight: Joi.number().optional(),
    material: Joi.string().optional()
  }).required()
});

module.exports.reviewValidationSchema = Joi.object({
  review: Joi.object({
    title: Joi.string().optional(),
    body: Joi.string().min(1).required(),
    fullName: Joi.string().optional(),
    email: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
    rating: Joi.number().min(1).max(5).required(),
  }).required()
});

module.exports.updateUserValidationSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  fullName: Joi.string().min(1).required(),
  phoneNumber: Joi.string(),
  profilePicture: Joi.string().optional(),
  address: Joi.string().optional()
}).optional();