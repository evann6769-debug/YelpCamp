require('dotenv').config();
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const User = require('../models/user');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Database connected'));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

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
];

const pickRandomImages = (pool, count) => {
  const chosen = new Set();
  while (chosen.size < count) {
    chosen.add(pool[Math.floor(Math.random() * pool.length)]);
  }
  return [...chosen];
};

const seedDB = async () => {
  console.log('Seeding started...');
  await Campground.deleteMany({});
  console.log('Old campgrounds deleted');

  const user = await User.findOne({});
  if (!user) throw new Error('No users found. Register a user first, then reseed.');

  for (let i = 0; i < 300; i++) {
    if (i % 25 === 0) console.log('seed progress:', i);

    const randomCityIndex = Math.floor(Math.random() * cities.length);
    const price = Math.floor(Math.random() * 20) + 10;

    const rawImages = pickRandomImages(imagePool, Math.random() < 0.7 ? 2 : 3);

    // ✅ cache-buster so images can't “all look the same” due to caching
    const images = rawImages.map((img, idx) => ({
      url: `${img.url}&sig=${i}-${idx}`,
      filename: img.filename,
    }));

    const camp = new Campground({
      author: user._id,
      location: `${cities[randomCityIndex].city}, ${cities[randomCityIndex].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'A beautiful campground with stunning views, peaceful surroundings, and great access to hiking trails.',
      price,
      geometry: {
        type: 'Point',
        coordinates: [cities[randomCityIndex].longitude, cities[randomCityIndex].latitude],
      },
      images,
    });

    await camp.save();
  }

  console.log('Seeding finished! 300 campgrounds created.');
};

seedDB()
  .then(() => mongoose.connection.close())
  .catch((err) => {
    console.error(err);
    mongoose.connection.close();
  });