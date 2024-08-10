const Account = require('../../src/models/account.js');

describe('Account model', () => {
  describe('constructor', () => {
    it('should create an account with a generated account number, name, and initial balance', () => {
      const name = 'John Doe';
      const initialBalance = 1000;
      const account = new Account(name, initialBalance);

      expect(account.accountNumber).toBeDefined(); // Check if account number is generated
      expect(typeof account.accountNumber).toBe('string'); // Ensure account number is a string
      expect(account.name).toBe(name);
      expect(account.balance).toBe(initialBalance);
    });

    it('should set initial balance to 0 if not provided', () => {
      const name = 'Jane Doe';
      const account = new Account(name);

      expect(account.balance).toBe(0);
    });
  });

  describe('deposit', () => {
    it('should increase the balance by the deposit amount', () => {
      const account = new Account('John Doe', 1000);
      const depositAmount = 500;

      account.deposit(depositAmount);

      expect(account.balance).toBe(1000 + depositAmount);
    });

    it('should throw an error if the deposit amount is not positive', () => {
      const account = new Account('John Doe', 1000);
      const invalidAmount = -100;

      expect(() => account.deposit(invalidAmount)).toThrowError('Deposit amount must be positive');
    });
  });

  describe('withdraw', () => {
    it('should decrease the balance by the withdraw amount', () => {
      const account = new Account('John Doe', 1000);
      const withdrawAmount = 200;

      account.withdraw(withdrawAmount);

      expect(account.balance).toBe(1000 - withdrawAmount);
    });

    it('should throw an error if the withdraw amount is not positive', () => {
      const account = new Account('John Doe', 1000);
      const invalidAmount = -100;

      expect(() => account.withdraw(invalidAmount)).toThrowError('Insufficient funds');
    });

    it('should throw an error if the withdraw amount exceeds the balance', () => {
      const account = new Account('John Doe', 1000);
      const insufficientAmount = 1500;

      expect(() => account.withdraw(insufficientAmount)).toThrowError('Insufficient funds');
    });
  });

  describe('getters', () => {
    it('should return the correct account id', () => {
      const account = new Account('John Doe', 1000);
      expect(account.id).toBeDefined();
    });
    
    it('should return the correct account number', () => {
      const account = new Account('John Doe', 1000);
      expect(account.accountNumber).toBeDefined();
    });

    it('should return the correct balance', () => {
      const account = new Account('John Doe', 1000);
      expect(account.balance).toBe(1000);
    });
  });
});
