const TransferService = require('../../src/services/transferService');
const AccountService = require('../../src/services/accountService');
const { OperationType, OperationStatus } = require('../../src/models/transferRequest');
const { accounts: accountsDb, transferRequests: transferRequestsDb } = require('../../src/db');
const cache = require('../../src/cache');

jest.mock('../../src/db', () => ({
  accounts: {},
  transferRequests: {},
}));
jest.mock('../../src/cache', () => {
  const cache = {};
  return {
    cache,
    get: jest.fn(
      (key) => cache[key]
    ),
    set: jest.fn(
      (key, value) => cache[key] = value
    ),
    delete: jest.fn(
      (key) => delete cache[key]
    ),
  };
});

describe('TransferService', () => {
  const transferService = new TransferService();
  let account1, account2;

  beforeEach(() => {
    const accountService = new AccountService();
    account1 = accountService.createAccount({ name: 'Alice', balance: 100 });
    account2 = accountService.createAccount({ name: 'Bob', balance: 50 });
  });

  afterEach(() => {
    Object.keys(accountsDb).forEach((key) => delete accountsDb[key]);
    Object.keys(transferRequestsDb).forEach((key) => delete transferRequestsDb[key]);
    Object.keys(cache).forEach((key) => cache.delete(key));
  });

  describe('createTransferRequest', () => {
    it('should create a deposit transfer request', () => {
      const data = {
        type: OperationType.DEPOSIT,
        fromAccountId: account1.id,
        amount: 50,
      };

      const transferRequest = transferService.createTransferRequest(data);

      expect(transferRequest.id).toBeDefined();
      expect(transferRequest.type).toBe(OperationType.DEPOSIT);
      expect(transferRequest.fromAccountId).toBe(account1.id);
      expect(transferRequest.toAccountId).toBeUndefined();
      expect(transferRequest.amount).toBe(50);
      expect(transferRequest.status).toBe(OperationStatus.PENDING);
      expect(transferRequestsDb[transferRequest.id]).toEqual(transferRequest);
    });

    it('should create a withdraw transfer request', () => {
      const data = {
        type: OperationType.WITHDRAW,
        fromAccountId: account1.id,
        amount: 50,
      };

      const transferRequest = transferService.createTransferRequest(data);

      expect(transferRequest.id).toBeDefined();
      expect(transferRequest.type).toBe(OperationType.WITHDRAW);
      expect(transferRequest.fromAccountId).toBe(account1.id);
      expect(transferRequest.toAccountId).toBeUndefined();
      expect(transferRequest.amount).toBe(50);
      expect(transferRequest.status).toBe(OperationStatus.PENDING);
      expect(transferRequestsDb[transferRequest.id]).toEqual(transferRequest);
    });

    it('should create a transfer transfer request', () => {
      const data = {
        type: OperationType.TRANSFER,
        fromAccountId: account1.id,
        toAccountId: account2.id,
        amount: 50,
      };

      const transferRequest = transferService.createTransferRequest(data);

      expect(transferRequest.id).toBeDefined();
      expect(transferRequest.type).toBe(OperationType.TRANSFER);
      expect(transferRequest.fromAccountId).toBe(account1.id);
      expect(transferRequest.toAccountId).toBe(account2.id);
      expect(transferRequest.amount).toBe(50);
      expect(transferRequest.status).toBe(OperationStatus.PENDING);
      expect(transferRequestsDb[transferRequest.id]).toEqual(transferRequest);
    });

    it('should throw error for invalid operation type', () => {
      const data = {
        type: 'invalid-type',
        fromAccountId: account1.id,
        amount: 50,
      };

      expect(() => transferService.createTransferRequest(data)).toThrow('Invalid operation type');
    });

    it('should throw error for non-existent account', () => {
      const data = {
        type: OperationType.TRANSFER,
        fromAccountId: account1.id,
        toAccountId: 'non-existent-id',
        amount: 50,
      };

      expect(() => transferService.createTransferRequest(data)).toThrow('To Account not found');
    });
  });

  describe('performTransferRequest', () => {
    it('should successfully perform a deposit', async () => {
      const data = {
        type: OperationType.DEPOSIT,
        fromAccountId: account1.id,
        amount: 50,
      };
      const transferRequest = transferService.createTransferRequest(data);

      transferService.performTransferRequest(transferRequest.id);

      expect(transferRequest.status).toBe(OperationStatus.SUCCESS);
      expect(accountsDb[account1.id].balance).toBe(150);
    });

    it('should successfully perform a withdraw', () => {
      const data = {
        type: OperationType.WITHDRAW,
        fromAccountId: account1.id,
        amount: 50,
      };
      const transferRequest = transferService.createTransferRequest(data);

      transferService.performTransferRequest(transferRequest.id);

      expect(transferRequest.status).toBe(OperationStatus.SUCCESS);
      expect(accountsDb[account1.id].balance).toBe(50);
    });

    it('should successfully perform a transfer', () => {
      const data = {
        type: OperationType.TRANSFER,
        fromAccountId: account1.id,
        toAccountId: account2.id,
        amount: 50,
      };
      const transferRequest = transferService.createTransferRequest(data);

      transferService.performTransferRequest(transferRequest.id);

      expect(transferRequest.status).toBe(OperationStatus.SUCCESS);
      expect(accountsDb[account1.id].balance).toBe(50);
      expect(accountsDb[account2.id].balance).toBe(100);
    });

    it('should handle insufficient funds', () => {
      const data = {
        type: OperationType.WITHDRAW,
        fromAccountId: account1.id,
        amount: 150,
      };
      const transferRequest = transferService.createTransferRequest(data);

      expect(() => transferService.performTransferRequest(transferRequest.id)).toThrow('Insufficient funds');
      expect(transferRequest.status).toBe(OperationStatus.FAILED);
      expect(accountsDb[account1.id].balance).toBe(100);
    });

    it('should handle locked situation', () => {
      const data = {
        type: OperationType.WITHDRAW,
        fromAccountId: account1.id,
        amount: 50,
      };
      const transferRequest = transferService.createTransferRequest(data);
      cache.set(transferRequest.id, true);

      expect(() => transferService.performTransferRequest(transferRequest.id)).toThrow('Operation is locked');
    });

    it('should handle operation status', () => {
      const data = {
        type: OperationType.WITHDRAW,
        fromAccountId: account1.id,
        amount: 50,
      };
      const transferRequest = transferService.createTransferRequest(data);
      transferRequest.updateStatus(OperationStatus.CANCELED);

      expect(() => transferService.performTransferRequest(transferRequest.id)).toThrow('Invalid operation status');
    });
  });
});

