const mongoose = require('mongoose');

const pointSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  lan: { type: String, required: [true, 'latitude is required'] },
  lon: { type: String, required: [true, 'longitude is required'] },
  title: { type: String, required: [true, 'title is required'] },
  // owner:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location: {
    coordinates: {
      type: [Number]
    }
  }
}, { versionKey: false });

module.exports = mongoose.model('Point', pointSchema);
