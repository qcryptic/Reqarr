var express = require('express');
var router = express.Router();
const auth = require('../service/auth-service');

router.post('/login', auth.login);
router.post('/register', auth.register);

module.exports = router;