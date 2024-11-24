const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler')
const { isLoggedIn, isAdmin, validateItem } = require('../middleware');
const { renderIndex, renderEdit, renderShow, updateItem, createItem, deleteItem, renderDiscounted } = require('../controllers/itemsController');
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage })


router.route('/')
  .get(asyncHandler(renderIndex))
  .post(isLoggedIn, upload.array('item[images]'), validateItem, asyncHandler(createItem))

router.route('/discounted')
  .get(asyncHandler(renderDiscounted))

router.get('/new', isLoggedIn, (req, res) => {
  res.render('items/new', {page: { title: 'newItemPage' }});
})

router.route('/:id')
  .get(asyncHandler(renderShow))
  .put(isLoggedIn, isAdmin, upload.array('item[images]'), validateItem, asyncHandler(updateItem))
  .delete(isLoggedIn, isAdmin, asyncHandler(deleteItem))

router.get('/:id/edit', isLoggedIn, isAdmin, asyncHandler(renderEdit))


module.exports = router;