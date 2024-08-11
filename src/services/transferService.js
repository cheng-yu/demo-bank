const { TransferRequest, OperationType, OperationStatus } = require('../models/transferRequest');
const AccountService = require('./accountService');
const { transferRequests: db } = require('../db');
const cache = require('../cache');

class TransferService {
  constructor() {
    this.accountService = new AccountService();
  }

  createTransferRequest(data) {
    const { type, fromAccountId, toAccountId, amount } = data;

    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    if (this.accountService.getAccountById(fromAccountId) === undefined) {
      throw new Error('From Account not found');
    }

    let transferRequest;
    switch (type) {
      case OperationType.DEPOSIT:
      case OperationType.WITHDRAW:
        transferRequest = new TransferRequest(type, fromAccountId, undefined, amount);
        break;
      case OperationType.TRANSFER:
        if (this.accountService.getAccountById(toAccountId) === undefined) {
          throw new Error('To Account not found');
        }
        transferRequest = new TransferRequest(type, fromAccountId, toAccountId, amount);
        break;
      default:
        throw new Error('Invalid operation type');
    }

    db[transferRequest.id] = transferRequest;
    return transferRequest;
  }

  performTransferRequest(id) {
    const transferRequest = this.getTransferRequestById(id);

    if (transferRequest.status !== OperationStatus.PENDING) {
      throw new Error('Invalid operation status');
    }

    const fromAccount = this.accountService.getAccountById(transferRequest.fromAccountId);
    if (fromAccount === undefined) {
      throw new Error('From Account not found');
    }

    let toAccount;
    if (transferRequest.toAccountId) {
      toAccount = this.accountService.getAccountById(transferRequest.toAccountId);
      if (toAccount === undefined) {
        throw new Error('To Account not found');
      }
    }

    const lockIds = [transferRequest.id, fromAccount.id, toAccount?.id];
    this.#checkAndAddLock(lockIds);
    
    try {
      switch (transferRequest.type) {
        case OperationType.DEPOSIT:
          fromAccount.deposit(transferRequest.amount);
          break;
        case OperationType.WITHDRAW:
          fromAccount.withdraw(transferRequest.amount);
          break;
        case OperationType.TRANSFER:
          fromAccount.withdraw(transferRequest.amount);
          toAccount.deposit(transferRequest.amount);
          break;
        default:
          throw new Error('Invalid operation type');
      }
  
      transferRequest.updateStatus(OperationStatus.SUCCESS);
      return transferRequest;
    } catch (error) {
      transferRequest.updateStatus(OperationStatus.FAILED);
      throw error;
    } finally {
      this.#releaseLock(lockIds);
    }
  }

  getTransferRequestById(id) {
    return db[id];
  }

  getTransferRequestList() {
    return Object.values(db);
  }

  #checkAndAddLock(ids) {
    ids.filter(id => id).forEach(id => {
      if (cache.get(id)) {
        throw new Error('Operation is locked');
      }
      cache.set(id, true);
    });
  }

  #releaseLock(ids) {
    ids.forEach(id => {
      cache.delete(id);
    });
  }
}

module.exports = TransferService;