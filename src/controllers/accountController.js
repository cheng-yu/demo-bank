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

const getAccountById = (req, res) => {
  const accountService = new AccountService();
  const account = accountService.getAccountById(req.params.id);
  if (!account) {
    res.status(404).send('Account not found');
  } else {
    res.json({ ...account, balance: account.balance });
  }
}

module.exports = {
  getAccounts,
  createAccount,
  getAccountById
};
