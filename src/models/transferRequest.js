const { v4: uuidv4 } = require('uuid');

const OperationType = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw',
  TRANSFER: 'transfer',
};

const OperationStatus = {
  PENDING: 'pending',
  SUCCESS: 'success',
  CANCELED: 'canceled',
  FAILED: 'failed',
};

class TransferRequest {
  #id;
  #type;
  #fromAccountId;
  #toAccountId;
  #amount;
  #createTimestamp;
  #updateTimestamp;
  #status;
  
  constructor(type, fromAccountId, toAccountId, amount, status = OperationStatus.PENDING) {
    if (!Object.values(OperationType).includes(type)) {
      throw new Error('Invalid operation type');
    }
    if (!Object.values(OperationStatus).includes(status)) {
      throw new Error('Invalid operation status');
    }

    if (type === OperationType.DEPOSIT || type === OperationType.WITHDRAW) {
      if (toAccountId) {
        throw new Error('Invalid operation type');
      }
    } else if (type === OperationType.TRANSFER) {
      if (!toAccountId) {
        throw new Error('Invalid operation type');
      }
    }

    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    this.#id = uuidv4();
    this.#type = type;
    this.#fromAccountId = fromAccountId;
    this.#toAccountId = toAccountId;
    this.#amount = amount;

    const now = new Date();
    this.#createTimestamp = now;
    this.#updateTimestamp = now;
    this.#status = status;
  }

  get id() {
    return this.#id;
  }

  get type() {
    return this.#type;
  }

  get fromAccountId() {
    return this.#fromAccountId;
  }

  get toAccountId() {
    return this.#toAccountId;
  }

  get amount() {
    return this.#amount;
  }

  get createTimestamp() {
    return this.#createTimestamp;
  }

  get updateTimestamp() {
    return this.#updateTimestamp;
  }

  get status() {
    return this.#status;
  }

  updateStatus(newStatus) {
    if (!Object.values(OperationStatus).includes(newStatus)) {
      throw new Error('Invalid operation status');
    }
    this.#status = newStatus;
    this.#updateTimestamp = new Date();
  }
}

module.exports = { TransferRequest, OperationType, OperationStatus };
