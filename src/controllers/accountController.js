const AccountService = require('../services/accountService');

const getAccounts = (req, res) => {
  const accountService = new AccountService();
  const accounts = accountService.getAccountList();
  res.json(accounts);
};

const createAccount = (req, res) => {
  const accountService = new AccountService();
  const account = accountService.createAccount({ 
    name: req.body.name, 
    balance: req.body.balance 
  });
  res.json(account);
};

module.exports = {
  getAccounts,
  createAccount
};
