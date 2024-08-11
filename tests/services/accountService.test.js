const AccountService = require('../../src/services/accountService');
const Account = require('../../src/models/account');

// Mock accounts database for testing
jest.mock('../../src/db', () => ({
  accounts: {},
}));

const { accounts: accountsDb } = require('../../src/db');

describe('AccountService', () => {
  const service = new AccountService();

  afterEach(() => {
    // Clear the accounts database after each test
    Object.keys(accountsDb).forEach((key) => delete accountsDb[key]);
  });

  describe('createAccount', () => {
    it('should create a new account and store it in the database', () => {
      const accountData = { name: 'John Doe', balance: 100 };
      const createdAccount = service.createAccount(accountData);

      expect(createdAccount).toBeInstanceOf(Account);
      expect(createdAccount.name).toBe(accountData.name);
      expect(createdAccount.balance).toBe(accountData.balance);
      expect(Object.keys(accountsDb).length).toBe(1);
      expect(accountsDb[createdAccount.id]).toEqual(createdAccount);
    });
  });

  describe('getAccountList', () => {
    it('should return a list of all accounts in the database', () => {
      const account1 = new Account('Alice', 200);
      const account2 = new Account('Bob', 50);
      accountsDb[account1.id] = account1;
      accountsDb[account2.id] = account2;

      const accountList = service.getAccountList();

      expect(accountList).toEqual([account1, account2]);
    });

    it('should return an empty list if there are no accounts in the database', () => {
      const accountList = service.getAccountList();

      expect(accountList).toEqual([]);
    });
  });

  describe('getAccountById', () => {
    it('should return the account with the specified ID', () => {
      const account1 = new Account('Alice', 200);
      const account2 = new Account('Bob', 50);
      accountsDb[account1.id] = account1;
      accountsDb[account2.id] = account2;

      const foundAccount = service.getAccountById(account1.id);

      expect(foundAccount).toEqual(account1);
    });

    it('should return undefined if the account with the specified ID is not found', () => {
      const accountId = 'non-existent-id';

      const foundAccount = service.getAccountById(accountId);

      expect(foundAccount).toBeUndefined();
    });
  });
});

