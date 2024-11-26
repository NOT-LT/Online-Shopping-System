const mongoose = require('mongoose');
const Review = require('./review');
const User = require('./user');
const { cloudinary } = require('../cloudinary');
const { Schema } = mongoose; // Destructuring assignment to get Schema directly


const imgSchema = new Schema({
  url: String,
  filename: String
});

imgSchema.virtual('thumbnail1')
  .get(function () {
    return this.url.replace('/upload', '/upload/w_250');
  })

  imgSchema.virtual('previewImage')
  .get(function () {
    return this.url.replace('/upload', '/upload/w_900/h_500');
  })

imgSchema.virtual('thumbnail2')
  .get(function () {
    return this.url.replace('/upload', '/upload/w_720');
  })

const ItemSchema = new Schema({
  title: String,
  itemCategory: {
    type: String,
    enum: ['Electronics', 'Clothing', 'Furniture', 'Books', 'Games'],
    required: true
  },
  price: String,
  images: [
    imgSchema
  ],
  description: String,
  postDate: {
    type: Date,
    default: Date.now()
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ],
  views: {
    type: Number,
    default: 0
  },
  colors: {
    type: [String],
    required: false
  },
  quantity: {
    type: Number,
    required: true
  },
  sizes: {
    type: [String],
    enum: ['sm', 'md', 'lg', 'xl'],
    required: false
  },
  width: {
    type: Number,
    required: false
  },
  height: {
    type: Number,
    required: false
  },
  depth: {
    type: Number,
    required: false
  },
  weight: {
    type: Number,
    required: false
  },
  material: {
    type: String,
    required: false
  },
  brand: {
    type: String,
    required: false
  },
  discount: {
    type: Number,
    required: false
  }
});

function addCommasToNumberInString(str) {
  return str.replace(/\d+/g, function (match) {
    return Number(match).toLocaleString();
  });
}

ItemSchema.pre('save', function (next) {
  this.price = addCommasToNumberInString(this.price.replace(',', ''))
  if (!this.price.includes('BHD')) { 
      this.price += ' BHD';
  }
  next();
});

ItemSchema.post('findOneAndDelete', async function (doc) { // this will be hit even for findByIdAndDelete
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    });
  }
})

ItemSchema.pre('deleteMany', async function (next) {
  const items = await this.model.find(this.getFilter());
  const itemsIds = items.map(item => item._id);
  await Review.deleteMany({ _id: { $in: itemsIds } });
  for (const item of items) {
    const images = item?.images;
    if (!images) {
      continue;
    }
    for (let img of images) {
      await cloudinary.uploader.destroy(img?.filename, (error, result) => {
        if (error) {
          next(error);
        }
      });
    }
  }
  next();
});

const Item = mongoose.model('Item', ItemSchema);
module.exports = Item;
