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
  },
   {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772303121/istockphoto-2218734127-612x612_u2h41i.webp",
    filename: "YelpCamp/photo10"
  },
  {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772303125/photo-1444124818704-4d89a495bbae_bkh4w8.avif",
    filename: "YelpCamp/photo11"
  },
  {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772303130/photo-1470246973918-29a93221c455_xr3tx1.avif",
    filename: "YelpCamp/photo12"
  },
  {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772303134/photo-1517824806704-9040b037703b_gckzzi.avif",
    filename: "YelpCamp/photo13"
  },
  {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772303152/photo-1537565266759-34bbc16be345_qzp74j.avif",
    filename: "YelpCamp/photo14"
  },
  {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772303157/photo-1534880606858-29b0e8a24e8d_lez4po.avif",
    filename: "YelpCamp/photo15"
  },
  {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772303160/photo-1565257074896-83694ab78bb6_m5y15x.avif",
    filename: "YelpCamp/photo16"
  },
  {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772303163/photo-1571687949921-1306bfb24b72_lvtanv.avif",
    filename: "YelpCamp/photo17"
  },
  {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772303166/photo-1578645510447-e20b4311e3ce_sst4iy.avif",
    filename: "YelpCamp/photo18"
  },
  {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772303169/photo-1602391833977-358a52198938_ykfddl.avif",
    filename: "YelpCamp/photo19"
  },
  {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772303171/photo-1660819731358-e197f235eeb7_sztiqo.avif",
    filename: "YelpCamp/photo20"
  },
  {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772303348/photo-1526491109672-74740652b963_vnk95s.avif",
    filename: "YelpCamp/photo21"
  },
  {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772303350/photo-1624923686627-514dd5e57bae_ytcbsd.avif",
    filename: "YelpCamp/photo22"
  },
  {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772303352/photo-1595923112485-5e7c738fa67b_se5jpj.avif",
    filename: "YelpCamp/photo23"
  },
  {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772303356/photo-1580842693665-cdae6f59814f_jkrxwy.avif",
    filename: "YelpCamp/photo24"
  },
  {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772303358/photo-1507777767380-68bdac55c642_hwiqed.avif",
    filename: "YelpCamp/photo25"
  },
  {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772303358/photo-1507777767380-68bdac55c642_hwiqed.avif",
    filename: "YelpCamp/photo26"
  },
  {
    url: "https://res.cloudinary.com/dlzj4cmhn/image/upload/v1772303360/photo-1476041800959-2f6bb412c8ce_ce9z2w.avif",
    filename: "YelpCamp/photo27"
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