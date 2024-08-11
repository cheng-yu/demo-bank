const Account = require('../models/account');
const { accounts: accountsDb } = require('../db');

class AccountService {
  createAccount(data) {
    const { name, balance } = data;
    const account = new Account(name, balance);
    accountsDb[account.id] = account;
    return account;
  }

  getAccountList() {
    return Object.values(accountsDb);
  }

  getAccountById(id) {
    return accountsDb[id];
  }
}

module.exports = AccountService;