const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Item = require('../mongooseModels/item');
const multer = require('multer')
const { storage, uploadFileToCloudinary } = require('../cloudinary'); // node automaitcally looks for index.js
const Review = require('../mongooseModels/review');
const User = require('../mongooseModels/user');
// Database connection


mongoose.connect('mongodb://localhost:27017/oss');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const categories = [
  'Electronics', 'Clothing', 'Furniture', 'Books', 'Games'
];

const getRandomPrice = (category, size) => {
  let basePrice;
  switch (category) {
    case 'Electronics':
      basePrice = 300;
      break;
    case 'Clothing':
      basePrice = 50;
      break;
    case 'Furniture':
      basePrice = 200;
      break;
    case 'Books':
      basePrice = 20;
      break;
    case 'Games':
      basePrice = 60;
      break;
    default:
      basePrice = 100;
  }

  switch (size) {
    case 'sm':
      return basePrice;
    case 'md':
      return basePrice * 1.5;
    case 'lg':
      return basePrice * 2;
    case 'xl':
      return basePrice * 2.5;
    default:
      return basePrice;
  }
};

const getImages = async () => {
  const arr = [];
  const n = faker.number.int({ min: 3, max: 6 });

  for (let i = 0; i < n; i++) {
    const result = await uploadFileToCloudinary(`https://picsum.photos/seed/${faker.number.int({ min: 1, max: 9999 })}/1280/720`);
    arr.push({
      url: result.secure_url,
      filename: result.public_id
    });
    console.log(result.secure_url);
  }

  console.log("Array: ", arr);
  return arr;
};

const getRandomDiscount = () => {
  let d = faker.number.int({ min: 10, max: 50 });
  if (d <= 19) {
    d = 10;
    return d;
  }
  else if (d <= 29) { 
    d = 25;
    return d;
  }
  else if (d <= 39) {
    d = 30;
    return d;
  }
  else {
    d = 50;
    return d;
  }

}

const seedDB = async () => {
  await Item.deleteMany({}); // Clear existing data
  await Review.deleteMany({}); // Clear existing data

  for (let i = 0; i < 10; i++) {
    // Generate random data for the item
    const category = faker.helpers.arrayElement(categories);
    const size = category === 'Clothing' ? ['sm', 'md', 'lg', 'xl'] : undefined;

    // Generate images
    const Rimages = await getImages();
    console.log("Images: ", Rimages);

    // Generate other item details
    let price = getRandomPrice(category, size).toLocaleString();

    const item = new Item({
      title: `${faker.commerce.productAdjective()} ${category}`,
      itemCategory: category,
      price: price.toString(),
      images: Rimages,
      description: faker.lorem.paragraph(),
      postDate: new Date(),
      views: faker.number.int({ min: 0, max: 250 }),
      colors: faker.helpers.arrayElements(['#000000', '#E5B769', '#57AFEF', '#1E2227', '#73C991', '#E06C75'], faker.number.int({ min: 1, max: 5 })),
      quantity: faker.number.int({ min: 1, max: 100 }),
      sizes: size,
      width: faker.number.float({ min: 30, max: 200 }).toFixed(1),
      height: faker.number.float({ min: 30, max: 200 }).toFixed(1),
      depth: faker.number.float({ min: 30, max: 200 }).toFixed(1),
      weight: faker.number.float({ min: 1, max: 100 }).toFixed(1),
      material: faker.commerce.productMaterial(),
      brand: faker.company.name(),
      reviews: [],
      discount: faker.datatype.boolean({ probability: 0.5}) ? getRandomDiscount() : 0
    });

    // Save the item to the database
    await item.save();
  }
};

seedDB().then(() => {
  console.log("Seed data generated successfully!");
  mongoose.connection.close();
});
