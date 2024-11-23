const Item = require('./mongooseModels/item')
const { itemValidationSchema, reviewValidationSchema, updateUserValidationSchema } = require('./validationSchemas')
const ExpressError = require('./utils/ExpressError');
const asyncHandler = require('./utils/asyncHandler');
const User = require('./mongooseModels/user');

module.exports.validateItem = (req, res, next) => {
  console.log(req.files);
  const { error } = itemValidationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(400, msg)
  }
  next()
}

module.exports.validateUpdateUserInfo = (req, res, next) => {
  console.log(req.body);
  const { error } = updateUserValidationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(400, msg)
  }
  next()
}

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewValidationSchema.validate(req.body);
  if (error) {
    console.log("validation review error")
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(400, msg)
  }
  next()
}

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectToUrl = req.originalUrl; // add this line
    req.flash('error', 'Please sign in first');
    return res.redirect('/login')
  }
  next();
};

module.exports.storeRedirectTo = (req, res, next) => {
  if (req.session.redirectToUrl) {
    res.locals.redirectToUrl = req.session.redirectToUrl;
  } else {
    // res.locals.redirectToUrl = req.get('Referer');
  }
  next();
}

module.exports.isAdmin = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  const user = await User.findById(id);
  if (!user.isAdmin) {
    req.flash('error', `You don't have access`)
    return res.redirect('/items/');
  }
  next();
})


module.exports.matchPassword = asyncHandler(async (req, res, next) => {
  const { password = '' } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    req.flash('error', 'User not found');
    return res.redirect('/settings#deleteAccount');
  }

  user.authenticate(password, (err, user, passwordError) => {
    if (err) {
      console.error(err);
      req.flash('error', 'An error occurred');
      return res.redirect('/settings#deleteAccount');
    }

    if (passwordError) {
      req.flash('error', 'Incorrect password');
      return res.redirect('/settings#deleteAccount');
    }

    // Password is correct, proceed to next middleware or function
    return next();
  });
})

//   user.changePassword(req.body.oldpassword, req.body.newpassword, function(err) ...