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
  {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772216329/download_klymwe.jpg",
    filename: "YelpCamp/photo1"
  },
  {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772216341/download_1_pgzlcx.jpg",
    filename: "YelpCamp/photo2"
  },
  {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772216347/download_3_jeaq3m.jpg",
    filename: "YelpCamp/photo3"
  },
    {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772216351/download_5_ypozuy.jpg",
    filename: "YelpCamp/photo4"
  },
  {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772216356/download_7_dcrtkn.jpg",
    filename: "YelpCamp/photo5"
  },
  {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772216359/download_8_ynzjeq.jpg",
    filename: "YelpCamp/photo6"
  },
    {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772216364/download_9_ara1id.jpg",
    filename: "YelpCamp/photo7"
  },
  {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772216372/way_up_in_the_mountains_ctdocl.jpg",
    filename: "YelpCamp/photo8"
  },
  {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772216376/download_10_q6mlpc.jpg",
    filename: "YelpCamp/photo9"
  }
];

const pickRandomImages = (pool, count) => {
  const chosen = new Set();
  while (chosen.size < count) {
    chosen.add(pool[Math.floor(Math.random() * pool.length)]);
  }
  return Array.from(chosen);
};

const seedDB = async () => {
  console.log('Seeding started...');
  await Campground.deleteMany({});
  console.log('Old campgrounds deleted');

  // 🔥 Ensure Evan exists
  let evan = await User.findOne({ username: 'Evan' });

  if (!evan) {
    console.log('Creating Evan user...');
    evan = new User({ username: 'Evan', email: 'evan@test.com' });
    await User.register(evan, 'password123'); // change password if you want
    console.log('Evan created');
  } else {
    console.log('Evan already exists');
  }

  for (let i = 0; i < 300; i++) {
  if (i % 25 === 0) console.log('Seeding progress:', i);

  const randomCityIndex = Math.floor(Math.random() * cities.length);
  const price = Math.floor(Math.random() * 20) + 10;

  // ✅ Use Cloudinary pool
  const images = pickRandomImages(imagePool, Math.random() < 0.7 ? 2 : 3);

  const camp = new Campground({
    author: evan._id,
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

  console.log('Seeding complete: 300 campgrounds created');
};

seedDB()
  .then(() => mongoose.connection.close())
  .catch((err) => {
    console.error(err);
    mongoose.connection.close();
  });