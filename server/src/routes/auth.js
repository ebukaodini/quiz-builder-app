const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const passwordHash = require('password-hash')
const randomstring = require("random-string-gen")
const Users = require('../models/users.model')
const mergeValidationErrors = require('../utils/mergeValidationErrors')

router.post('/register',
  body('firstname', 'Please enter a valid firstname.')
    .trim()
    .isLength({ min: 1 }),
  body('lastname', 'Please enter a valid lastname.')
    .trim()
    .isLength({ min: 1 }),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom(async value => {
      return Users.find({ email: value })
        .then(user => user.length > 0
          && Promise.reject('User with email already exists.')
        )
    }),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 8 characters.')
    .matches(/\d/)
    .withMessage('Password must contain a number.')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter.')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter.')
    .matches(/[ !"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/)
    .withMessage('Password must contain a special character.'),
  body('cpassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Password confirmation is incorrect.'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req).array();
      if (errors.length > 0)
        return res.error('Invalid fields', mergeValidationErrors(errors))

      const { firstname, lastname, email, password } = req.body
      const hashedPassword = passwordHash.generate(password)

      Users.create({ firstname, lastname, email, password: hashedPassword })
        .then(async user => {
          // automatically log user in
          const jwt = require('jsonwebtoken')
          const token = jwt.sign({ user: user._id }, process.env.TOKEN_SECRET, { expiresIn: '21600s' /*6hrs*/ });

          return res.success('Account created.', {
            authToken: token,
            user: { firstname, lastname, email, id: user._id }
          })
        })

    } catch (error) {
      next(error)
    }
  })

router.post('/login',
  body('email').trim(),
  body('password').trim(),
  async (req, res, next) => {
    const { email, password } = req.body
    Users.findOne({ email })
      .then(async user => {
        if (user === null)
          return res.error('Invalid email / password.')

        if (passwordHash.verify(password, user.password)) {
          const { firstname, lastname, email, _id: id } = user
          const payload = { firstname, lastname, email, id }

          const jwt = require('jsonwebtoken')
          const token = jwt.sign({ user: payload.id }, process.env.TOKEN_SECRET, { expiresIn: '21600s' /*6hrs*/ });

          return res.success('Login successful', {
            authToken: token,
            user: payload
          })
        }
        else return res.error('Invalid email / password.')
      })
      .catch(error => {
        next(error)
      })
  })

module.exports = router