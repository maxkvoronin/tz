const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

module.exports.register = async (req, res, next) => {
  try {
    await UserModel.create({
      username:    req.body.username,
      password:    req.body.password,
      email:       req.body.email
    });

    res.status(201).json({ success: true, message: 'user created' });
  } catch (err) {

    // if (err.code === 11000) {
    //   res.status(409).json({ success: false, message: 'user already exists' });
    // }
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const user = await UserModel.findOne()
      .where({ username: req.body.username })
      .exec();

    if (!user) {
      return res.status(401).json({ success: false, message: 'unknown username' });
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!err && isMatch) {
        const token = jwt.sign(user.toObject(), 'secret-word', { expiresIn: '1d' });
        return res.status(200).json({ success: true, token: 'JWT ' + token, userId: user._id });
      }
      res.status(401).send({ success: false, message: 'Authentication failed. Wrong password' });
    });

  } catch (err) {
    next(err);
  }
};
