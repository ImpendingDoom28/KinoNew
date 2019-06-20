const express = require('express');
const router = express.Router();

// Main page is the login page
router.get('/', (req, res) => res.render('login'));

module.exports = router;