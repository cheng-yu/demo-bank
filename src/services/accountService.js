const Account = require('../models/account');
const { accounts: accountsDb } = require('../db');

class AccountService {
  createAccount(data) {
    const account = new Account(data.name, data.balance);
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