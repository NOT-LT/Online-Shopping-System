const express = require('express');
const User = require('../mongooseModels/user');
const Item = require('../mongooseModels/item');
const { cloudinary } = require('../cloudinary');


// module.exports.getAdminDashboard = async (req, res, next) => {
//   try {
//     const userId = req?.user?.id;
//     const user = await User.findById(userId);
//     res.render('dashboard', { page: { title: 'User Dashboard' },properties, views, inquiries});
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// };

module.exports.deleteUser = async (req, res, next) => {
  if (!req?.user?.id) {
    req.flash('error', 'You need to be logged in to delete your account');
    return res.redirect('/login');
  }

  const user = await User.findById(req?.user?.id);
  if (!user) {
    req.flash('error', 'User not found');
    return res.redirect('/items');
  }
  if (user.profilePicture?.filename) {
    await cloudinary.uploader.destroy(user.profilePicture?.filename, (error, result) => {
      if (error) {
        next(error);
      }
    });
  }
  await user.deleteOne();
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'We are sorry to see you leave');
    return res.redirect('/items');
  });

}

module.exports.getUserSettings = async (req, res, next) => {
  const user = await User.findById(req?.user?.id);
  res.render('userSettings', { user });
}

module.exports.postUserSettings = async (req, res, next) => {
  const user = await User.findById(req?.user?.id);
  user.email = req.body.email;
  user.fullName = req.body.fullName;
  console.log('ctrlUsers - req file: ', req.file);
  if (req.file) {
    // console.log('ctrlUsers - req files: ', req.files);
    if (user?.profilePicture?.filename) {
      await cloudinary.uploader.destroy(user.profilePicture?.filename, (error, result) => {
        if (error) {
          next(error);
        }
      });
    }
    const profilePicture = { url: req.file?.path, filename: req.file?.filename }
    user.profilePicture = profilePicture;
  }
  await user.save();
  req.flash('success', 'info updated successfully')
  return res.status(200).redirect('/settings');
}

module.exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password, fullName, phoneNumber } = req.body;
    const user = new User({ username, email, password, fullName, phoneNumber });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) next(err);
      req.flash('success', `We're happy to have you ${registeredUser.username}`);
      return res.redirect('/items');
    });
  } catch (e) {
    req.flash('error', e.message) // if user/email already registered, passport-local-mongoose throwns an error
    return res.redirect('/register');
  }
}

module.exports.loginUser = async (req, res) => {
  req.flash('success', `Welcome back ${req.user.username}`);
  const redirectToUrl = res.locals.redirectToUrl || '/items';
  return res.redirect(redirectToUrl);
}

module.exports.logoutUser = async (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Goodbye!');
    return res.redirect('/items');
  });
}

module.exports.renderRegisterForm = async (req, res) => {
  res.render('register', { page: { title: 'register' } });
}

module.exports.renderLoginForm = async (req, res) => {
  return res.render('login', { page: { title: 'login' } });
}

module.exports.renderProfile = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render('users/profile', { user });
}

module.exports.getShoppingCart = async (req, res) => {
  const user = await User.findById(req?.user?.id).populate('shoppingCart');
  return res.status(200).json({ status: 'OK', shoppingCart: user.shoppingCart });
}

module.exports.addToShoppingCart = async (req, res) => {
  const user = await User.findById(req?.user?.id);
  const itemId = req.body.itemId;
  const itemColor = req.body.itemColor;
    if (user.shoppingCart.some(item =>  {item.item == itemId && item.color == itemColor})) {
      user.shoppingCart.forEach(item => {
        if (item.item == itemId) {
          item.qty += 1;
        }
      });
    } else {
      const item = await Item.findById(itemId);
      user.shoppingCart.push({ item, qty: 1, color: itemColor });
    }


  await user.save();
  req.flash('success', 'Item added to shopping cart');
  return res.redirect('/items/' + itemId);
}

module.exports.renderCheckout = async (req, res) => {
  const user = await User.findById(req?.user?.id).populate('shoppingCart.item');
  const shoppingCart = user.shoppingCart;
  return res.render('checkout', { shoppingCart });
};