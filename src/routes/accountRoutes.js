const express = require('express');
const accountController = require('../controllers/accountController');

const router = express.Router();

router.get('/', accountController.getAccounts);

module.exports = router;

