var express = require('express');
var router = express.Router();

// API page route.
router.get('/api', function (req, res) {
  res.send('API home page');
});

module.exports = router;