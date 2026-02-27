require('dotenv').config();
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];


// 🔥 Image Pool (add as many as you want)
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
  { url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60', filename: 'unsplash/camp10' }
];


// ✅ Guaranteed unique random image picker
const pickRandomImages = (pool, count) => {
  const chosen = new Set();

  while (chosen.size < count) {
    const randomImage = pool[Math.floor(Math.random() * pool.length)];
    chosen.add(randomImage);
  }

  return Array.from(chosen);
};


const seedDB = async () => {
  await Campground.deleteMany({});
  console.log('Old campgrounds deleted');

  for (let i = 0; i < 300; i++) {

    const randomCityIndex = Math.floor(Math.random() * cities.length);
    const price = Math.floor(Math.random() * 20) + 10;

    const images = pickRandomImages(
      imagePool,
      Math.random() < 0.7 ? 2 : 3
    );

    const camp = new Campground({
      author: process.env.SEED_USER_ID, // 🔥 Put this in your .env file
      location: `${cities[randomCityIndex].city}, ${cities[randomCityIndex].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'A beautiful campground with stunning views, peaceful surroundings, and great access to hiking trails.',
      price,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[randomCityIndex].longitude,
          cities[randomCityIndex].latitude
        ]
      },
      images
    });

    await camp.save();
  }

  console.log('300 campgrounds seeded!');
};


seedDB()
  .then(() => mongoose.connection.close())
  .catch((err) => {
    console.error(err);
    mongoose.connection.close();
  });