const TranserService = require('../services/transferService');

const createTransferRequest = (req, res) => {
  const transerService = new TranserService();
  try {
    const transferRequest = transerService.createTransferRequest({
      type: req.body.type,
      fromAccountId: req.body.fromAccountId,
      toAccountId: req.body.toAccountId,
      amount: req.body.amount
    });
    res.json(transferRequest);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const performTransferRequest = (req, res) => {
  const transerService = new TranserService();
  try {
    const transferRequest = transerService.performTransferRequest(req.params.id);
    res.json(transferRequest);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const getTransferRequests = (req, res) => {
  const transerService = new TranserService();
  const transferRequests = transerService.getTransferRequestList();
  res.json(transferRequests);
}

const getTransferRequestById = (req, res) => {
  const transerService = new TranserService();
  const transferRequest = transerService.getTransferRequestById(req.params.id);
  if (!transferRequest) {
    res.status(404).send('Transfer Request not found');
  } else {
    res.json(transferRequest);
  }
}

module.exports = {
  createTransferRequest,
  performTransferRequest,
  getTransferRequests,
  getTransferRequestById
};
