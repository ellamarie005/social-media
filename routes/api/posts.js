const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// loading model
const Post = require('../../models/Post');

//loading validation
const validatePostInput = require('../../validation/post');

// route: this is a GET request api/posts/test
// description: Test post route
// access: Public
router.get('/test', (req, res) => {res.json({msg: 'Posts Works'});});

// route: this is a POST request api/posts
// description: Create post
// access: Private
router.post('/', passport.authenticate('jwt', {session: false}, (req, res) => {
  const {errors, isValid} = validatePostInput(req.body);
  // check validate
  if (!isValid) {
    return res.status(404).json(errors);
  }
  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });
  newPost.save().then(post => {
    res.json(post);
  })
}));

module.exports = router;