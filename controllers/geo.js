const streamToMongoDB = require('stream-to-mongo-db').streamToMongoDB;

const split2 = require('split2');
const through2 = require('through2');

const outputDBConfig = { dbURL: 'mongodb+srv://test:testtest@cluster0-dl7ek.mongodb.net/test?retryWrites=true&w=majority', collection: 'points' };
const PointModel = require('../models/Point');

module.exports.saveGeoFile = async (req, res, next) => {
  try {
    const writableStream = streamToMongoDB(outputDBConfig);
    req.pipe(split2())
      .pipe(transformToObj())
      .pipe(writableStream)
      .on('finish', () => res.status(200).json({ success: true, message: 'ok' }))
      .on('error', err => next(err));
  } catch (err) {
    next(err);
  }
};

module.exports.getAreaPointsQuantity = async (req, res, next) => {
  try {
    // let polygons = [
    //   [
    //     [59.962530, 30.157293],
    //     [59.964705, 30.319775],
    //     [59.913255, 30.327663],
    //     [59.914047, 30.176223],
    //     [59.962530, 30.157293]
    //   ],
    //   [
    //     [59.942728, 30.238468],
    //     [59.946000, 30.323956],
    //     [59.917484, 30.328591],
    //     [59.916363, 30.238125],
    //     [59.942728, 30.238468]
    //   ]
    // ];

    const area = {
      type: 'Polygon',
      coordinates: [[
        [59.962530, 30.157293],
        [59.964705, 30.319775],
        [59.913255, 30.327663],
        [59.914047, 30.176223],
        [59.962530, 30.157293]
      ]]
    };

    const point = await PointModel.count().where('location').within(area).exec();

    res.status(200).json({ success: true, message: point });

  } catch (err) {
    next(err);
  }
};

const transformToObj = () => {
  return through2.obj((line, enc, cb) => {
    const geo = line.split(' ] ')[0].slice(2).split(', ');
    const title = line.split(' ] ')[1];
    // todo validation
    if (geo[0] && geo[1]) {
      return cb(null, { lat: geo[0], lon: geo[1], title, location: { coordinates: [Number(geo[1]), Number(geo[0])], type: 'Point' } });
    } else { return cb(null, null); }
  });
};
