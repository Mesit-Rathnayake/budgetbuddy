const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

router.get('/currency', settingsController.getCurrency);
router.put('/currency', settingsController.setCurrency);

module.exports = router;
