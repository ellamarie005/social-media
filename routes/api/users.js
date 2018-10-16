const express = require('express');

const router = express.Router();

// route: this is a GET request api/users/test
// description: Test post route
// access: Public
router.get('/test', (req, res) => {
  res.json({msg: 'Users Works'});
});

module.exports = router;