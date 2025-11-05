const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const auth = require('../middleware/authMiddleware');

router.use(auth);

router.get('/currency', settingsController.getCurrency);
router.put('/currency', settingsController.setCurrency);

module.exports = router;
