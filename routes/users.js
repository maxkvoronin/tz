const express = require('express');
const router = express.Router();

const Joi = require('@hapi/joi');
const validator = require('express-joi-validation').createValidator({
  passError: true
});
const regSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string()
});

const ctrlUsers = require('../controllers/users');

router.post('/register', validator.body(regSchema), ctrlUsers.register);
router.post('/login', validator.body(regSchema), ctrlUsers.login);

module.exports = router;
