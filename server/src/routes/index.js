var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  return res.success('Welcome to Quiz App!')
});

module.exports = router;
