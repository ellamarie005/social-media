const express = require('express');
const router = express.Router();
// bcrypt will allow the password to be encrypted
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys');
const gravatar = require('gravatar');

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User model
const User = require('../../models/User');

// route: this is a POST request api/users/test
// description: Test post route
// access: Public
router.get('/test', (req, res) => {
  res.json({ msg: 'Users Works' });
});

// route: this is a GET request api/users/register
// description: register a user
// access: Public

router.post('/register', (req, res) => {
  // errors and isValid all came from the register.js in the validation folder.
  // the req.body in the validateRegisterInput is from input and passing them through the validation function
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  // 1. find if email exists
  // the req.body.email will eventually be a form from the REACT side
  // note: make sure bodyParser is passed in server.js is req.body will be used
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200', //Size
          r: 'pg', // Rating
          d: 'mm' // Default - if there's no photo available
        });
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          // since avatar is equals avatar, you can actually just call avatar by itself.
          avatar: avatar,
          password: req.body.password
        });

        // genSalt will take parameters, 10 is the characters, then pass on a callback function
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // turn the newUser's password into hash
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err))
          });
        });
      }
    });
});

// route: this is a GET request api/users/login
// description: login a user
// access: Public

router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  //Find the user by email
  User.findOne({ email })
    .then(user => {
      // Check if user exist or not
      if (!user) {
        errors.email = 'User not found!';
        return res.status(400).json(errors);
      }

      // Check password using .compare
      // user.password is the one created from the hash
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            // User Match

            const payload = { id: user.id, name: user.name, avatar: user.avatar } // Create JWT payload
            //Sign Token
            jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              });
            });
          } else {
            errors.password = 'Password Incorrect'
            return res.status(400).json(errors);
          }
        })
    });
});

// route: this is a GET request api/users/current
// description: return current user
// access: Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
  });
})


module.exports = router;
