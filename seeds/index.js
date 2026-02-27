require('dotenv').config();
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Database connected'));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

// ✅ A pool of image objects to choose from (add more anytime)
const imagePool = [
  { url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=60', filename: 'unsplash/camp1' },
  { url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=60', filename: 'unsplash/camp2' },
  { url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=60', filename: 'unsplash/camp3' },
  { url: 'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?auto=format&fit=crop&w=1200&q=60', filename: 'unsplash/camp4' },
  { url: 'https://images.unsplash.com/photo-1500043357865-c6b8827edf7e?auto=format&fit=crop&w=1200&q=60', filename: 'unsplash/camp5' },
  { url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=60', filename: 'unsplash/camp6' },
  { url: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=60', filename: 'unsplash/camp7' },
  { url: 'https://images.unsplash.com/photo-1501706362039-c6e80948b54c?auto=format&fit=crop&w=1200&q=60', filename: 'unsplash/camp8' },
  { url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1200&q=60', filename: 'unsplash/camp9' },
  { url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60', filename: 'unsplash/camp10' },
  { url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1200&q=60', filename: 'unsplash/camp11' },
  { url: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=60', filename: 'unsplash/camp12' },
  { url: 'https://images.unsplash.com/photo-1519817650390-64a93db511aa?auto=format&fit=crop&w=1200&q=60', filename: 'unsplash/camp13' },
  { url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=60', filename: 'unsplash/camp14' },
  { url: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=60', filename: 'unsplash/camp15' }
];

// ✅ pick N unique random images from the pool
const pickRandomImages = (pool, count) => {
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const seedDB = async () => {
  await Campground.deleteMany({});

  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;

    // 2 or 3 random images each time
    const images = pickRandomImages(imagePool, Math.random() < 0.7 ? 2 : 3);

    const camp = new Campground({
      author: '5f5c330c2cd79d538f2c66d9', // make sure this user exists
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'A beautiful campground with stunning views, peaceful surroundings, and great access to hiking trails.',
      price,
      geometry: {
        type: 'Point',
        coordinates: [cities[random1000].longitude, cities[random1000].latitude],
      },
      images,
    });

    await camp.save();
  }
};

seedDB()
  .then(() => mongoose.connection.close())
  .catch((err) => {
    console.error(err);
    mongoose.connection.close();
  });