const streamToMongoDB = require('stream-to-mongo-db').streamToMongoDB;

const split2 = require('split2');
const through2 = require('through2');

const outputDBConfig = { dbURL: 'mongodb+srv://test:testtest@cluster0-dl7ek.mongodb.net/test?retryWrites=true&w=majority', collection: 'points' };
const PointModel = require('../models/Point');
const readFilePromise = require('fs-readfile-promise');

module.exports.saveGeoFile = (req, res, next) => {
  const writableStream = streamToMongoDB(outputDBConfig);
  req.pipe(split2())
    /* simple parsing of user coordinates file using streams in object mode */
    .pipe(transformToObj())
    /* piping with MongoDB writable stream */
    .pipe(writableStream)
    .on('finish', () => res.status(200).json({ success: true, message: 'points saved' }))
    .on('error', err => next(err));
};

module.exports.getAreaPointsQuantity = async (req, res, next) => {
  try {
    let points = [];

    /* reading file with polygons from server */
    const data = await readFilePromise('polygons.json', 'utf8');
    const polygons = JSON.parse(data);

    /* getting count of detected points from each polygon for current user */
    for (let index = 0; index < polygons.length; index++) {
      const count = await PointModel.countDocuments()
        .where('location')
        .within({
          type: 'Polygon',
          coordinates: [polygons[index]]
          // todo insert coordinates owner
        })
        .exec();

      points.push({ polygonIndexNumber: index, detectedPoints: count });
    }

    res.status(200).json({ success: true, message: points });

  } catch (err) {
    next(err);
  }
};

const transformToObj = () => {
  return through2.obj((line, enc, cb) => {
    const geo = line.split(' ] ')[0].slice(2).split(', ');
    const title = line.split(' ] ')[1];
    // todo user coordinates validation
    if (geo[0] && geo[1]) {
      return cb(null, { title, location: { coordinates: [Number(geo[1]), Number(geo[0])], type: 'Point' } });
    } else { return cb(null, null); }
  });
};
