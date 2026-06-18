const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addLog, getLogs } = require('../controllers/logs');

// Add a log
router.post('/', auth, addLog);

// Get logs for user
router.get('/', auth, getLogs);

module.exports = router;
