const express = require('express');

const router = express.Router();

// route: this is a GET request api/posts/test
// description: Test post route
// access: Public
router.get('/test', (req, res) => {
  res.json({msg: 'Posts Works'});
});

module.exports = router;