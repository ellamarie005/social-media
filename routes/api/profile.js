const express = require('express');

const router = express.Router();

// route: this is a GET request api/profile/test
// description: Test post route
// access: Public
router.get('/test', (req, res) => {
  res.json({msg: 'Profile Works'});
});

module.exports = router;