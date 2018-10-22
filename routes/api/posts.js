const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// loading model
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

//loading validation
const validatePostInput = require('../../validation/post');

// route: this is a GET request api/posts/test
// description: Test post route
// access: Public
router.get('/test', (req, res) => { res.json({ msg: 'Posts Works' }); });

// route: this is a GET request api/posts
// description: Get post
// access: Public

router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostfound: 'No posts found' }))
});

// route: this is a GET request api/posts/:id
// description: Get post by id
// access: Public

router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ nopostfound: 'No post found with that ID' }))
});

// route: this is a POST request api/posts
// description: Create post
// access: Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);
  // check validate
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });
  newPost.save().then(post => res.json(post));
});

// route: this is a DELETE request api/posts/:id
// description: delete post
// access: Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  // need to check profile first to make sure that it is the right owner
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: 'User not authorized' });
          }
          // Delete
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No postfound' }));
    });
});

// route: this is a POST request api/posts/like/:id
// description: liking a post
// access: Private

router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  // need to check profile first to make sure that it is the right owner
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ alreadyliked: 'User already liked this post' })
          }
          // Add user id to likes array
          post.likes.unshift({ user: req.user.id });

          // saving the like
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No postfound' }));
    });
});

// route: this is a POST request api/posts/UNLIKE/:id
// description: unliking a post
// access: Private

router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  // need to check profile first to make sure that it is the right owner
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ notliked: 'You have not liked this post' })
          }

          // Get remove index
          const removeIndex = post.likes.map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice out of the array
          post.likes.splice(removeIndex, 1);

          // Save
          post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({ postnotfound: 'No postfound' }));
    });
});

module.exports = router;