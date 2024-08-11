const Account = require('../models/account');
const { accounts: db } = require('../db');

class AccountService {
  createAccount(data) {
    const { name, balance } = data;
    const account = new Account(name, balance);
    db[account.id] = account;
    return account;
  }

  getAccountList() {
    return Object.values(db);
  }

  getAccountById(id) {
    return db[id];
  }
}

module.exports = AccountService;