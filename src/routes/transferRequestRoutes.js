const express = require('express');
const transferRequestController = require('../controllers/transferRequestController');

const router = express.Router();

router.get('/', transferRequestController.getTransferRequests);
router.post('/', transferRequestController.createTransferRequest);
router.get('/:id', transferRequestController.getTransferRequestById);
router.post('/:id/perform', transferRequestController.performTransferRequest);

module.exports = router;