const AccountService = require('../services/accountService');

const getAccounts = async (req, res) => {
  const accountService = new AccountService();
  const accounts = await accountService.getAccountList();
  res.json(accounts);
};

module.exports = {
  getAccounts,
};
