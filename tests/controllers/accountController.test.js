const request = require('supertest');
const { app, server } = require('../../app');
const AccountService = require('../../src/services/accountService');

const accountService = new AccountService();

describe('GET /accounts', () => {
  afterAll(() => {
    server.close();
  });

  it('should respond with 200 and a list of accounts', async () => {
    accountService.createAccount({ name: 'Account 1', balance: 100 });

    const response = await request(app).get('/accounts');
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);

    const account = response.body[0];
    expect(account.id).toBeDefined();
    expect(account.accountNumber).toBeDefined();
    expect(account.name).toBe('Account 1');
    expect(account.balance).toBe(undefined);
  });
});

describe('POST /accounts', () => {
  afterAll(() => {
    server.close();
  });

  it('should respond with 200 and the created account', async () => {
    const response = await request(app)
      .post('/accounts')
      .send({ name: 'New Account', balance: 100 });
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.accountNumber).toBeDefined();
    expect(response.body.name).toBe('New Account');
    expect(response.body.balance).toBe(undefined);
  });
});
