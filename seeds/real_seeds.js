const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Item = require('../mongooseModels/item');
const Review = require('../mongooseModels/review');
const User = require('../mongooseModels/user');
const { uploadFileToCloudinary } = require('../cloudinary'); // Cloudinary setup

// Database connection
mongoose.connect('mongodb://localhost:27017/oss', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

// Real data for items
const realItems = [
  {
    title: 'iPhone 16 Pro 512GB',
    category: 'Electronics',
    brand: 'Apple',
    price: '750 BHD',
    images: [
      'https://mac-center.com.pr/cdn/shop/files/iPhone_16_Pro_Black_Titanium_PDP_Image_Position_1__en-US_c962c90d-310f-48be-b194-bd6af6ffb96b.jpg',
      'https://www.apple.com/v/iphone-16-pro/c/images/overview/welcome/hero_endframe__b3cjfkquc2s2_xlarge.jpg',
      'https://www.apple.com/mideast/iphone-16-pro/c/images/overview/product-viewer/iphone-pro/sa-t3/all_colors__fdpduog7urm2_xlarge.jpg',
    ],
  },
  {
    title: 'Samsung S24 Ultra 256GB',
    category: 'Electronics',
    brand: 'Samsung',
    price: '580 BHD',
    images: [
      'https://litphones.co.za/wp-content/uploads/2024/03/Samsung-Galaxy-S24-Ultra-Titanium-Black-600x600.jpg',
    ],
  },
  {
    title: 'HP Pavilion x360 i7-12th GEN 512GB SSD',
    category: 'Electronics',
    brand: 'HP',
    price: '460 BHD',
    images: [
      'https://rukminim2.flixcart.com/image/850/1000/ktketu80/computer/w/h/l/14-dy0050tu-thin-and-light-laptop-hp-original-imag6w29hw5cw4hn.jpeg?q=90&crop=false',
      'https://i5.walmartimages.com/asr/f0fe083a-842d-44a7-a88c-251949ca5a67.93251549285fc24edfb0d90c741dcfec.jpeg',
    ],
  },
  {
    title: 'Apple Watch Series 10 - Cellular',
    category: 'Electronics',
    brand: 'Apple',
    price: '320 BHD',
    images: [
      'https://www.apple.com/newsroom/images/2024/09/introducing-apple-watch-series-10/article/Apple-Watch-Series-10-Smart-Stack-240909_inline.jpg.large.jpg',
      'https://www.apple.com/v/apple-watch-series-10/a/images/meta/apple-watch-series-10__c6destep56c2_og.png?202409060739',
    ],
  },
  {
    title: 'Sony QV-K36 4K',
    category: 'Electronics',
    brand: 'Sony',
    price: '400 BHD',
    images: [
      'https://sonyworld.bh/cdn/shop/products/sony-KD65X75K-1_ee485fbb-707f-4e13-8689-45666621b6ba.jpg?v=1675756869',
      'https://store.sony.co.nz/dw/image/v2/ABBC_PRD/on/demandware.static/-/Sites-sony-master-catalog/default/dw71c91cef/images/KD43X75K/KD43X75K_08.jpg',
    ],
  },
  {
    title: 'JBL Bar 1000: 7.1.4-Channel Soundbar',
    category: 'Electronics',
    brand: 'JBL',
    price: '350 BHD',
    images: [
      'https://m.media-amazon.com/images/I/5152Bv5nVcL._AC_SX466_.jpg',
      'https://m.media-amazon.com/images/I/81xQVv2WiAL._AC_SX466_.jpg',
      'https://m.media-amazon.com/images/I/71VmiwTK3BL._AC_SX466_.jpg',
      'https://m.media-amazon.com/images/I/81RebmrI3tL._AC_SX466_.jpg',
    ],
  },
  {
    title: 'Gaming Desktop PC, AMD Ryzen 7 7500X, NVIDIA GeForce RTX 4060, 32GB DDR4',
    category: 'Electronics',
    brand: 'AMD',
    price: '700 BHD',
    images: [
      'https://c1.neweggimages.com/productimage/nb1280/83-630-061-01.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/83-630-061-03.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/83-630-061-10.jpg',
      'https://c1.neweggimages.com/productimage/nb1280/83-630-061-04.jpg',
    ],
  },
  {
    title: 'Casual 100% Men Cotton T-shirts',
    category: 'Clothing',
    brand: 'Polo Ralph Lauren',
    price: '12 BHD',
    images: [
      'https://img.kwcdn.com/product/open/2024-08-13/1723536310600-aa3a864114694fb298e4ae56cd2842f0-goods.jpeg',
      'https://img.kwcdn.com/product/open/2024-08-13/1723536323656-5688a9936c904799a9f2e369e0c92be6-goods.jpeg',
    ],
  },
  {
    title: 'Men Elegant Cotton Formal Shirts',
    category: 'Clothing',
    brand: 'Hugo Boss',
    price: '25 BHD',
    images: [
      'https://img.kwcdn.com/product/fancy/1bc5a37c-4419-4006-b028-b22f8d03abe0.jpg',
    ],
  },
  {
    title: 'Semi-formal Men T-shirts - Fabric and breathable',
    category: 'Clothing',
    brand: 'H&M',
    price: '15 BHD',
    images: [
      'https://img.kwcdn.com/product/fancy/ced86556-510a-4c7d-b394-75accbfe36d7.jpg',
      'https://img.kwcdn.com/product/fancy/2b63f2c3-f947-41a6-b410-cae6459db9f0.jpg',
    ],
  },
  {
    title: 'Modern Minimalist Oval Coffee Table',
    category: 'Furniture',
    brand: 'IKEA',
    price: '85 BHD',
    images: [
      'https://img.kwcdn.com/product/fancy/347ed41d-738d-4382-a08b-f5c2f9142f6b.jpg',
      'https://img.kwcdn.com/product/fancy/5f34f1bb-0d23-48dd-898a-76b07951a5f4.jpg',
    ],
  },
  {
    title: '1pc Modern Tree-Shaped 10-Tier Wooden Bookshelf',
    category: 'Furniture',
    brand: 'IKEA',
    price: '65 BHD',
    images: [
      'https://img.kwcdn.com/product/open/f99e463025e44ef4950f466229d2a605-goods.jpeg',
      'https://img.kwcdn.com/product/open/53eb9ae95b144ed9963a3b27408b3bda-goods.jpeg',
    ],
  },
  {
    title: 'Freestanding Wardrobe with Curtain Door, Steel Frame, Durable Storage Cabinet',
    category: 'Furniture',
    brand: 'Home Centre',
    price: '120 BHD',
    images: [
      'https://img.kwcdn.com/product/fancy/f70820d9-e3e4-40ee-b729-80803f4181bc.jpg',
    ],
  },
  {
    title: 'Song of Ice and Fire',
    category: 'Books',
    brand: 'George R.R. Martin',
    price: '45 BHD',
    images: [
      'https://m.media-amazon.com/images/I/71kTa-3HsJL._UF1000,1000_QL80_.jpg',
    ],
  },
  {
    title: 'The World as Will and Representation, Vol. 1',
    category: 'Books',
    brand: 'Arthur Schopenhauer',
    price: '20 BHD',
    images: [
      'https://m.media-amazon.com/images/I/71LTdkx-v+L._AC_UF1000,1000_QL80_.jpg',
      'https://res.cloudinary.com/hzpwrwfdi/image/upload/w_220/media/covers/the-world-as-will-and-representation-vol-1_vjbnpz.webp',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Arthur_Schopenhauer_Portrait_by_Ludwig_Sigismund_Ruhl_1815.jpeg/220px-Arthur_Schopenhauer_Portrait_by_Ludwig_Sigismund_Ruhl_1815.jpeg',
    ],
  },
  {
    title: 'The Complete Works of William Shakespeare',
    category: 'Books',
    brand: 'William Shakespeare',
    price: '35 BHD',
    images: [
      'https://www.lowplexbooks.com/cdn/shop/files/3_ca8ec82b-ebec-40a8-b8db-130f0f79c537_800x.jpg',
    ],
  },
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


// Random discount generator
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
  await Item.deleteMany({});
  await Review.deleteMany({});
  await User.deleteMany({});

  // Create users
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = new User({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      shoppingCart: [],
      orders: [],
      phoneNumber: faker.phone.number('3########'),
      address: faker.address.streetAddress(),
      isAdmin: faker.datatype.boolean(),
      profilePicture: {
        url: faker.image.avatar(),
        filename: 'default.jpg',
      },
      fullName: faker.name.fullName(),
    });
    await user.save();
    users.push(user);
  }

  // Create items from real data
  for (const itemData of realItems) {
    const uploadedImages = [];
    for (const img of itemData.images) {
      const result = await uploadFileToCloudinary(img);
      uploadedImages.push({
        url: result.secure_url,
        filename: result.public_id,
      });
      console.log(result.secure_url);
    }

    const item = new Item({
      title: itemData.title,
      itemCategory: itemData.category,
      brand: itemData.brand,
      price: itemData.price,
      images: uploadedImages,
      description: faker.lorem.paragraph(),
      postDate: new Date(),
      views: faker.number.int({ min: 0, max: 250 }),
      colors: (itemData.category === 'Furniture' || itemData.category === 'Clothing' || itemData.category === 'Electronics') ? faker.helpers.arrayElements(['#000000', '#E5B769', '#57AFEF', '#1E2227', '#73C991', '#E06C75'], faker.number.int({ min: 1, max: 5 })) : [],
      quantity: faker.number.int({ min: 1, max: 100 }),
      width: faker.number.float({ min: 10, max: 100 }).toFixed(1),
      height: faker.number.float({ min: 10, max: 100 }).toFixed(1),
      depth: faker.number.float({ min: 10, max: 100 }).toFixed(1),
      weight: faker.number.float({ min: 1, max: 10 }).toFixed(1),
      material: faker.commerce.productMaterial(),
      discount: faker.datatype.boolean({ probability: 0.3 }) ? getRandomDiscount() : 0,
      reviews: [],
    });

    // Add reviews
    const numReviews = faker.number.int({ min: 1, max: 10 });
    for (let j = 0; j < numReviews; j++) {
      const review = new Review({
        title: faker.lorem.sentence(),
        body: faker.lorem.paragraph(),
        rating: faker.number.int({ min: 1, max: 5 }),
        author: faker.helpers.arrayElement(users)._id,
      });
      await review.save();
      item.reviews.push(review);
    }

    await item.save();
  }

  console.log('Seeding complete!');
  mongoose.connection.close();
};

seedDB();
