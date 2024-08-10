const { v4: uuidv4 } = require('uuid');

class Account {
  #balance;

  constructor(name, balance = 0) {
    this.id = uuidv4();
    this.accountNumber = uuidv4();
    this.name = name;
    this.#balance = balance;
  }

  get balance() {
    return this.#balance;
  }

  deposit(amount) {
    if (amount <= 0) {
      throw new Error('Deposit amount must be positive');
    }
    this.#balance += amount;
  }

  withdraw(amount) {
    if (amount <= 0 || amount > this.balance) {
      throw new Error('Insufficient funds');
    }
    this.#balance -= amount;
  }
}

module.exports = Account;