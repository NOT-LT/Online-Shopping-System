const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError')
const asyncHandler = require('../utils/asyncHandler')
const { storeRedirectTo, validateUpdateUserInfo, matchPassword } = require('../middleware');
const passport = require('passport')
const User = require('../mongooseModels/user');
const { registerUser, loginUser, logoutUser, renderRegisterForm, renderLoginForm,renderCheckout,
  getUserDashboard, getUserSettings, postUserSettings, deleteUser, addToShoppingCart, getShoppingCart } = require('../controllers/usersController');
const { isLoggedIn } = require('../middleware');
const { storageProfilePicture } = require('../cloudinary/index')
const multer = require('multer');
const uploadProfilePicture = multer({ storage: storageProfilePicture });

router.route('/register')
  .get(asyncHandler(renderRegisterForm))
  .post(asyncHandler(registerUser))

router.route('/login')
  .get(asyncHandler(renderLoginForm))
  .post(storeRedirectTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), asyncHandler(loginUser))

router.route('/shoppingCart')
  .get(asyncHandler(getShoppingCart))
  .post(asyncHandler(addToShoppingCart))

router.get('/dashboard', isLoggedIn, asyncHandler(getUserDashboard));

router.get('/checkout', isLoggedIn, asyncHandler(renderCheckout));

router.route('/settings')
  .all(isLoggedIn) // Apply isLoggedIn middleware to all methods on this route)
  .get(asyncHandler(getUserSettings))
  .post(uploadProfilePicture.single('profilePicture'), validateUpdateUserInfo, asyncHandler(postUserSettings))
  .delete(matchPassword, asyncHandler(deleteUser))

router.get('/logout', asyncHandler(logoutUser))

module.exports = router;