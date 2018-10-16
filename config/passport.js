// read passport documentation
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
// the users is coming from the User Schema
const User = mongoose.model('users');
const keys = require('../config/keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload.id)
    .then(user => {
      if (user) {
        return done(null, user);
      } return done(null, false);
    })
    .catch(err => console.log(err));
  }));
};

// Section 3 - #13
// so what we did was when user logs in, accessToken(Bearer ...) is provided.
// accessToken is then required by adding fromAuthHeaderAsBearerToken to access a protected route
// when successful, the user information is returned -- all under this module exports
// all these steps is when we can accept the tokens and validate the user