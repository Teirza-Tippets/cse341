const express = require('express');
const router = express.Router();
const { getName } = require('../controllers/nameController');

router.get('/', getName);

module.exports = router;
