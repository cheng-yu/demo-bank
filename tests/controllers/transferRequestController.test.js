const request = require('supertest');
const { app, server } = require('../../app');
const TransferService = require('../../src/services/transferService');
const AccountService = require('../../src/services/accountService');

const transferService = new TransferService();
const accountService = new AccountService();

describe('TransferRequestController', () => {
  let account1;
  let account2;

  beforeEach(() => {
    account1 = accountService.createAccount({ name: 'Account 1', balance: 100 });
    account2 = accountService.createAccount({ name: 'Account 2', balance: 100 });
  });

  afterAll(() => {
    server.close();
  });

  describe('GET /transfer-requests', () => {
    it('should respond with 200 and a list of transfer requests', async () => {
      transferService.createTransferRequest({ type: 'transfer', fromAccountId: account1.id, toAccountId: account2.id, amount: 100 });
  
      const response = await request(app).get('/transfer-requests');
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(1);
  
      const transferRequest = response.body[0];
      expect(transferRequest.id).toBeDefined();
      expect(transferRequest.type).toBe('transfer');
      expect(transferRequest.fromAccountId).toBe(account1.id);
      expect(transferRequest.toAccountId).toBe(account2.id);
      expect(transferRequest.amount).toBe(100);
      expect(transferRequest.status).toBe('pending');
    });
  });

  describe('POST /transfer-requests', () => {
    it('should respond with 200 and the created transfer request', async () => {
      const response = await request(app)
        .post('/transfer-requests')
        .send({ type: 'transfer', fromAccountId: account1.id, toAccountId: account2.id, amount: 100 });
      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBeDefined();
      expect(response.body.type).toBe('transfer');
      expect(response.body.fromAccountId).toBe(account1.id);
      expect(response.body.toAccountId).toBe(account2.id);
      expect(response.body.amount).toBe(100);
      expect(response.body.status).toBe('pending');
    });

    it('should respond with 400 if amount is negative', async () => {
      const response = await request(app)
        .post('/transfer-requests')
        .send({ type: 'transfer', fromAccountId: account1.id, toAccountId: account2.id, amount: -100 });
      expect(response.statusCode).toBe(400);
      expect(response.text).toBe('Amount must be positive');
    });

    it('should respond with 400 if from account does not exist', async () => {
      const response = await request(app)
        .post('/transfer-requests')
        .send({ type: 'transfer', fromAccountId: 'invalid-id', toAccountId: account2.id, amount: 100 });
      expect(response.statusCode).toBe(400);
      expect(response.text).toBe('From Account not found');
    });

    it('should respond with 400 if to account does not exist', async () => {
      const response = await request(app)
        .post('/transfer-requests')
        .send({ type: 'transfer', fromAccountId: account1.id, toAccountId: 'invalid-id', amount: 100 });
      expect(response.statusCode).toBe(400);
      expect(response.text).toBe('To Account not found');
    });

    it('should respond with 400 if operation type is invalid', async () => {
      const response = await request(app)
        .post('/transfer-requests')
        .send({ type: 'invalid-type', fromAccountId: account1.id, toAccountId: account2.id, amount: 100 });
      expect(response.statusCode).toBe(400);
      expect(response.text).toBe('Invalid operation type');
    });
  });

  describe('GET /transfer-requests/:id', () => {
    it('should respond with 404 if transfer request does not exist', async () => {
      const response = await request(app).get('/transfer-requests/invalid-id');
      expect(response.statusCode).toBe(404);
      expect(response.text).toBe('Transfer Request not found');
    });

    it('should respond with 200 and the transfer request', async () => {
      const transferRequest = transferService.createTransferRequest({ type: 'transfer', fromAccountId: account1.id, toAccountId: account2.id, amount: 100 });
  
      const response = await request(app).get(`/transfer-requests/${transferRequest.id}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(transferRequest.id);
      expect(response.body.type).toBe('transfer');
      expect(response.body.fromAccountId).toBe(account1.id);
      expect(response.body.toAccountId).toBe(account2.id);
      expect(response.body.amount).toBe(100);
      expect(response.body.status).toBe('pending');
    });
  });

  describe('POST /transfer-requests/:id/perform', () => {
    it('should respond with 200 and the transfer request', async () => {
      const transferRequest = transferService.createTransferRequest({ type: 'transfer', fromAccountId: account1.id, toAccountId: account2.id, amount: 100 });
  
      const response = await request(app).post(`/transfer-requests/${transferRequest.id}/perform`);
      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(transferRequest.id);
      expect(response.body.type).toBe('transfer');
      expect(response.body.fromAccountId).toBe(account1.id);
      expect(response.body.toAccountId).toBe(account2.id);
      expect(response.body.amount).toBe(100);
      expect(response.body.status).toBe('success');
    });

    it('should respond with 400 if transfer request status is not pending', async () => {
      const transferRequest = transferService.createTransferRequest({ type: 'transfer', fromAccountId: account1.id, toAccountId: account2.id, amount: 100 });
      transferService.performTransferRequest(transferRequest.id);
  
      const response = await request(app).post(`/transfer-requests/${transferRequest.id}/perform`);
      expect(response.statusCode).toBe(400);
      expect(response.text).toBe('Invalid operation status');
    });

    it('should respond with 400 if transfer request is locked', async () => {
      const transferRequest = transferService.createTransferRequest({ type: 'transfer', fromAccountId: account1.id, toAccountId: account2.id, amount: 10 });
  
      const [ response1, response2 ] = await Promise.all(
        [
          request(app).post(`/transfer-requests/${transferRequest.id}/perform`),
          request(app).post(`/transfer-requests/${transferRequest.id}/perform`),
          request(app).post(`/transfer-requests/${transferRequest.id}/perform`),
          request(app).post(`/transfer-requests/${transferRequest.id}/perform`)
        ]
      );

      expect(account1.balance).toBe(90);
      expect(account2.balance).toBe(110);
      expect([response1.statusCode, response2.statusCode]).toContain(400);
      expect(response1.statusCode === 400 ? response1.text : response2.text).toBe('Invalid operation status');
    });
  });
});
