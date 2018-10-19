const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load user and profile model
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// route: this is a GET request api/profile/test
// description: Test post route
// access: Public
router.get('/test', (req, res) => {
  res.json({msg: 'Profile Works'});
});

// route: this is a GET request api/profile
// description: Get current users profile
// access: Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const errors = {};
  Profile.findOne({user: req.user.id})
  .then(profile => {
    if(!profile) {
      errors.noprofile = 'There is no profile for this user';
      return res.status(400).json(errors);
    }
    res.json(profile);
  })
  .catch(err => res.status(404).json(err));
})

module.exports = router;