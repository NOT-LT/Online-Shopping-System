const express = require('express');
const ExpressError = require('../utils/ExpressError')
const Item = require('../mongooseModels/item');
const { cloudinary } = require('../cloudinary');
const maptilerClient = require('@maptiler/client');
const User = require('../mongooseModels/user');
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.renderIndex = async (req, res) => {
  const items = await Item.find({});
  res.render('items/index', { items, page: { title: 'indexPage' } })
};

module.exports.renderShow = async (req, res) => {
  const { id } = req.params;
  const item = await Item.findById(id);
  await item.populate('reviews');
  for (let review of item.reviews) {
    await review.populate('author');
  }
  item.views += 1;
  await item.save();
  if (!item) {
    throw new ExpressError('404', 'There is no item with this id')
  }

  res.render('items/show', { item, page: { title: 'showItemPage' } })

  // }).catch((error) => {
  //   res.render('itemsies/show', { itemsy, lan: 0, lon: 0, page: { title: 'showPage' } })
  // });
  // await itemsy.save();

}


module.exports.renderEdit = async (req, res) => {
  const { id } = req.params;
  const item = await Item.findById(id);
  if (!item) {
    throw new ExpressError('404', 'There is no item with this id')
  }
  res.render('items/edit', { item, page: { title: 'editItemPage' } })
}

module.exports.createItem = async (req, res) => {
  const item = new Item({ ...req.body.item });
  item.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
  item.save();
  
  console.log("create page item:", item);
  req.flash('success', 'Successfully listed a new item!')
  res.redirect(`items/${item._id}`)
}


module.exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  await Item.findByIdAndDelete(id);
  res.redirect('/items');
}

module.exports.updateItem = async (req, res) => {
  const { id } = req.params;
  let { deletedImgs } = req.body;
  deletedImgs = deletedImgs.split(',').filter(img => img.length > 0);
  const item = await Item.findByIdAndUpdate(id, { ...req.body.item }, { new: true });
  let newImages = req.files?.map(f => ({ url: f.path, filename: f.filename }));
  let Images = [...item?.images, ...newImages];
  if (deletedImgs !== 'undefined' && deletedImgs !== '') {
    // await itemsy.updateOne({ $pull: { images: { filename: { $in: deletedImgs } } } });
    // Another approach to delete from mongoose

    Images = Images.filter(img => !(deletedImgs.includes(img?.filename)));

    for (let filename of deletedImgs) {
      cloudinary.uploader.destroy(filename, (error, result) => {
        if (error) {
          next(error);
        }
      });
    }
  }
  item.images = Images;
  
  req.flash('success', 'Successfully updated item info!')
  res.redirect(`/items/${id}`)
}

