const { TransferRequest, OperationType, OperationStatus } = require('../../src/models/transferRequest');

describe('TransferRequest', () => {
  describe('constructor', () => {
    it('should create a valid transferRequest for deposit', () => {
      const transferRequest = new TransferRequest(
        OperationType.DEPOSIT,
        'accountId1',
        null,
        100
      );

      expect(transferRequest.type).toBe(OperationType.DEPOSIT);
      expect(transferRequest.fromAccountId).toBe('accountId1');
      expect(transferRequest.toAccountId).toBeNull();
      expect(transferRequest.amount).toBe(100);
      expect(transferRequest.status).toBe(OperationStatus.PENDING);
      expect(transferRequest.createTimestamp).toBeDefined();
      expect(transferRequest.updateTimestamp).toBeDefined();
    });

    it('should create a valid transferRequest for withdraw', () => {
      const transferRequest = new TransferRequest(
        OperationType.WITHDRAW,
        'accountId1',
        null,
        100
      );

      expect(transferRequest.type).toBe(OperationType.WITHDRAW);
      expect(transferRequest.fromAccountId).toBe('accountId1');
      expect(transferRequest.toAccountId).toBeNull();
      expect(transferRequest.amount).toBe(100);
      expect(transferRequest.status).toBe(OperationStatus.PENDING);
      expect(transferRequest.createTimestamp).toBeDefined();
      expect(transferRequest.updateTimestamp).toBeDefined();
    });

    it('should create a valid transferRequest for transfer', () => {
      const transferRequest = new TransferRequest(
        OperationType.TRANSFER,
        'accountId1',
        'accountId2',
        100
      );

      expect(transferRequest.type).toBe(OperationType.TRANSFER);
      expect(transferRequest.fromAccountId).toBe('accountId1');
      expect(transferRequest.toAccountId).toBe('accountId2');
      expect(transferRequest.amount).toBe(100);
      expect(transferRequest.status).toBe(OperationStatus.PENDING);
      expect(transferRequest.createTimestamp).toBeDefined();
      expect(transferRequest.updateTimestamp).toBeDefined();
    });

    it('should throw an error for invalid transferRequest type', () => {
      expect(() => {
        new TransferRequest('invalidType', 'accountId1', 'accountId2', 100);
      }).toThrow('Invalid operation type');
    });

    it('should throw an error for invalid operation status', () => {
      expect(() => {
        new TransferRequest(OperationType.DEPOSIT, 'accountId1', null, 100, 'invalidStatus');
      }).toThrow('Invalid operation status');
    });

    it('should throw an error for invalid toAccountId for deposit', () => {
      expect(() => {
        new TransferRequest(OperationType.DEPOSIT, 'accountId1', 'accountId2', 100);
      }).toThrow('Invalid operation type');
    });

    it('should throw an error for missing toAccountId for transfer', () => {
      expect(() => {
        new TransferRequest(OperationType.TRANSFER, 'accountId1', null, 100);
      }).toThrow('Invalid operation type');
    });

    it('should throw an error for invalid amount', () => {
      expect(() => {
        new TransferRequest(OperationType.DEPOSIT, 'accountId1', null, -100);
      }).toThrow('Amount must be positive');
    });
  });

  describe('updateStatus', () => {
    it('should update status successfully', () => {
      const transferRequest = new TransferRequest(OperationType.DEPOSIT, 'accountId1', null, 100);
      const newStatus = OperationStatus.SUCCESS;

      transferRequest.updateStatus(newStatus);;

      expect(transferRequest.status).toBe(newStatus);
      expect(transferRequest.updateTimestamp).not.toBe(transferRequest.createTimestamp);
    });

    it('should throw an error for invalid status', () => {
      const transferRequest = new TransferRequest(OperationType.DEPOSIT, 'accountId1', null, 100);
      const newStatus = 'invalidStatus';

      expect(() => transferRequest.updateStatus(newStatus)).toThrow('Invalid operation status');
    });
  });
});
