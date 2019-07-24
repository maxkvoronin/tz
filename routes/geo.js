const express = require('express');
const router = express.Router();
const passport = require('passport');

const ctrlGeo = require('../controllers/geo');

router.use(passport.authenticate('jwt', { session: false }));

router.post('/save', ctrlGeo.saveGeoFile);
router.get('/pointquantity', ctrlGeo.getAreaPointsQuantity);

module.exports = router;
