if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const path = require('path');
const expressSession = require('express-session');
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError')
const asyncHandler = require('./utils/asyncHandler')
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./mongooseModels/user');
const Item = require('./mongooseModels/item');

const itemsRoute = require('./routes/items')
const reviewsRoute = require('./routes/review')
const usersRoute = require('./routes/users')
mongoose.connect('mongodb://localhost:27017/oss');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
})

const app = express();
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'));
const sessionConfig = {
  secret: 'changeMeLater',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(expressSession(sessionConfig))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash())

app.use(asyncHandler(async (req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user; // passport stores user info in session and we have access to it in all templates
  if (req.isAuthenticated()) {
    const user = await User.findById(req?.user?.id);
    user.populate('shoppingCart');
    await user.populate('shoppingCart.item');
    const cartItems = user.shoppingCart;
    res.locals.cartItems = cartItems;
  } else {
    res.locals.cartItems = [];
  }

  if (!(res.locals.page)) {
    res.locals.page = { page: { title: '' } }
  }
  next();
}))


app.get('/', asyncHandler(async (req, res) => {
  res.redirect('/items');
}))

app.use('/', usersRoute);
app.use('/items/:id/review', reviewsRoute)
app.use('/items', itemsRoute)


app.get('/search',  asyncHandler(async (req, res) => {
  const searchValue = req.query.q;
  let itemCategoriesFilter = req.query.itemCategoryFilter.toString().split(',');
  let itemBrandFilter = req.query.brandFilter.toString().split(',');
  let itemPriceRangeFilter = req.query.priceRangeFilter.toString().split(',');
  itemCategoriesFilter = itemCategoriesFilter.filter((item) => item !== '');
  itemBrandFilter = itemBrandFilter.filter((item) => item !== '');
  itemPriceRangeFilter = itemPriceRangeFilter.filter((item) => item !== '');
  const items = await Item.find({  }).populate('reviews');
  if (searchValue === '' || searchValue === undefined || searchValue === null || searchValue.toLowerCase() == 'all') {
    const filteredItems = items.filter((item)=> {
      let match = true;
      if (itemCategoriesFilter && itemCategoriesFilter.length !=0 && !(itemCategoriesFilter.includes(item.itemCategory))) {
        match = false;
      }
      if (itemBrandFilter && itemBrandFilter.length !=0 && !(itemBrandFilter.includes(item.brand))) {
        match = false;
      }
      if (itemPriceRangeFilter && itemPriceRangeFilter.length !=0) {
        const price = parseFloat(item.price);
        console.log("pp:" + itemPriceRangeFilter); 
        console.log("pp2:" + price); 
        if (itemPriceRangeFilter.includes('<=20BHD') && (price > 20)) {
          match = false;
        }
        if (itemPriceRangeFilter.includes('<=50BHD') && (price> 50)) {
          match = false;
        }
        if (itemPriceRangeFilter.includes('<=100BHD') && (price > 100)) {
          match = false;
        }
        if (itemPriceRangeFilter.includes('<=250BHD') && (price > 250)) {
          match = false;
        }
        if (itemPriceRangeFilter.includes('<=500BHD') && (price > 500)) {
          match = false;
        }
        if (itemPriceRangeFilter.includes('+500BHD') && !(price >= 500)) {
          match = false;
        }
      }
      return match;
    });
    res.render('items/searchResult', { items:filteredItems, searchValue, page: { title: 'Search Results' } });
  } else {
    const filteredItems = items.filter((item)=> {
      let match = true;
      if (!(item.title.toLowerCase().includes(searchValue.toLowerCase()) || item.description.toLowerCase().includes(searchValue.toLowerCase()) || item.brand.toLowerCase().includes(searchValue.toLowerCase()))) {
        match = false;
      }
      if (itemCategoriesFilter && itemCategoriesFilter.length !=0 && !(itemCategoriesFilter.includes(item.itemCategory))) {
        match = false;
      }
      if (itemBrandFilter && itemBrandFilter.length !=0 && !(itemBrandFilter.includes(item.brand))) {
        match = false;
      }
      if (itemPriceRangeFilter && itemPriceRangeFilter.length !=0 && !(itemPriceRangeFilter.includes(item.price))) {
        match = false;
      }
      return match;
    })
    res.render('items/searchResult', { items:filteredItems, searchValue, page: { title: 'Search Results' } });
  }
  // try {
  //   const query = req.query.q; // Get query from request parameters
  //   const propertyType = req.query.propertyTypeFilter.toString().toLowerCase() || 'all types';
  //   const location = req.query.locationFilter.toLowerCase() || 'all locations' ;
  //   // const price = req.query.averagePriceFilter.toLowerCase() || 'all prices';
  //   const listingType = req.query.listingTypeFilter.toLowerCase() || 'all';
  //   console.log('Search query:', query);
  //   if (query === '' || query === undefined || query === null || query.toLowerCase() == 'all') {
  //     const properties = await Item.find({  });
  //     const filteredProperties = properties.filter(item => {
  //       console.log(item);
  //       let match = true;
  //       if (propertyType && !(propertyType.includes(item.propertyType.toLowerCase())) && propertyType !== 'all types') {
  //         console.log('Item Type:', propertyType, item.propertyType);
  //         match = false;
  //       }
  //       if (location && !(location.includes(item.location.toLowerCase())) && location !== 'all locations') {
  //         match = false;
  //       }
  //       // if (price && price !== item.price && price !== 'all prices') {
  //       //   match = false;
  //       // }
  //       if (listingType && !(listingType.includes(item.listingType)) && listingType !== 'all') {
  //         match = false;
  //       }
  //       return match;
  //     });
  //     res.render('properties/searchResult', { properties:filteredProperties, searchQuery:query, page: { title: 'Search Results' } });
  //     return;
  //   }
  //   const searchResults = await typesenseClient.collections('properties').documents().search({
  //     q: query,
  //     query_by: 'title,description,location,price,propertyType'
  //   });
  //   console.log("searchResult: ", searchResults)
  //   const resultProperties = searchResults.hits.map(hit => hit.document);
  //   const filteredProperties = resultProperties.filter(item => {
  //     console.log(item);
  //     let match = true;
  //     if (propertyType && propertyType !== item.propertyType && propertyType !== 'all types') {
  //       console.log('Item Type:', propertyType, item.propertyType);
  //       match = false;
  //     }
  //     if (location && location !== item.location && location !== 'all locations') {
  //       match = false;
  //     }
  //     // if (price && price !== item.price && price !== 'all prices') {
  //     //   match = false;
  //     // }
  //     if (listingType && listingType !== item.listingType && listingType !== 'all') {
  //       match = false;
  //     }
  //     return match;
  //   });
  //   const properties = [];
  //   for (let i = 0; i < filteredProperties.length; i++) {
  //     const item = filteredProperties[i];
  //     console.log('Current Item:', item);
  //     const propertyDoc = await Item.findOne({ title: item.title, postDate: item.postDate });
  //     properties.push(propertyDoc);
  //   }
  //   console.log('Search results:', properties);
  //   res.render('properties/searchResult', { properties, searchQuery:query, page: { title: 'Search Results' } });
  // } catch (error) {
  //   console.error('Error performing search:', error);
  //   res.status(500).json({ error: 'Error performing search' });
  // }
}));




app.use('*', (req, res, next) => {
  throw new ExpressError(404, 'Not Found')
})
app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'error occured' } = err;
  const stack = err.stack;
  console.log(statusCode, message)
  res.status(statusCode).render('error', { statusCode, message, stack })
})





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
})
