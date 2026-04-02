const request = require('supertest');
const app = require('../../src/app');

describe('POST /transactions', () => {
  beforeEach(async () => {
    await request(app)
      .post('/transactions/seed-wallets')
      .send({
        data: [
          { id: 1, userId: 1, chain: 'ethereum', balance: 1000 },
          { id: 2, userId: 2, chain: 'polygon', balance: 300 },
        ],
      });
  });

  it('should perform a valid transfer', async () => {
    const response = await request(app)
      .post('/transactions')
      .send({
        fromWalletId: 1,
        toWalletId: 2,
        amount: 200,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.transaction.status).toBe('SUCCESS');
    expect(response.body.sourceWallet.balance).toBe(800);
    expect(response.body.targetWallet.balance).toBe(500);
  });

  it('should reject transfer when balance is insufficient', async () => {
    const response = await request(app)
      .post('/transactions')
      .send({
        fromWalletId: 1,
        toWalletId: 2,
        amount: 5000,
      });

    expect(response.statusCode).toBe(409);
    expect(response.body.error).toBe('insufficient balance');
  });

  it('should reject self-transfer', async () => {
    const response = await request(app)
      .post('/transactions')
      .send({
        fromWalletId: 1,
        toWalletId: 1,
        amount: 100,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('self-transfer is not allowed');
  });

  it('should reject negative amount', async () => {
    const response = await request(app)
      .post('/transactions')
      .send({
        fromWalletId: 1,
        toWalletId: 2,
        amount: -50,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('amount must be greater than 0');
  });
});