const Campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");
const moment = require('moment');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({}).populate('popupText');
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body?.campground?.location,
    limit: 1
  }).send();

  // Guard: bad/missing location OR Mapbox token issues -> no features
  if (!geoData.body.features || geoData.body.features.length === 0) {
    req.flash('error', 'Location not found. Please enter a real place.');
    return res.redirect('/campgrounds/new');
  }

  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;

  // Guard: if no files uploaded, req.files could be undefined
  campground.images = (req.files || []).map(f => ({ url: f.path, filename: f.filename }));

  campground.author = req.user._id;
  await campground.save();

  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: { path: 'author' }
    })
    .populate('author');

    res.render('campgrounds/show', { campground, moment 
    });

  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }

  res.render('campgrounds/show', {
    campground,
    mapToken: process.env.MAPBOX_TOKEN
  });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });

  // if you handle images:
  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);
  await campground.save();

  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}