const express = require('express');

const router = express.Router();

let transactions = [];
let nextTransactionId = 1;
const wallets = [];

function resetState(data) {
  wallets.length = 0;
  transactions.length = 0;
  nextTransactionId = 1;

  data.forEach((wallet) => wallets.push({ ...wallet }));
}

router.post('/seed-wallets', (req, res) => {
  const { data } = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({ error: 'data must be an array' });
  }

  resetState(data);

  return res.status(200).json({
    message: 'wallets seeded',
    wallets,
  });
});

router.get('/wallets-state', (req, res) => {
  return res.status(200).json({ wallets, transactions });
});

router.post('/', (req, res) => {
  const { fromWalletId, toWalletId, amount } = req.body;
  const numericAmount = Number(amount);

  if (!fromWalletId || !toWalletId || Number.isNaN(numericAmount)) {
    return res.status(400).json({
      error: 'fromWalletId, toWalletId and valid amount are required',
    });
  }

  if (fromWalletId === toWalletId) {
    return res.status(400).json({ error: 'self-transfer is not allowed' });
  }

  if (numericAmount <= 0) {
    return res.status(400).json({ error: 'amount must be greater than 0' });
  }

  const source = wallets.find((w) => w.id === fromWalletId);
  const target = wallets.find((w) => w.id === toWalletId);

  if (!source || !target) {
    return res.status(404).json({ error: 'wallet not found' });
  }

  if (source.balance < numericAmount) {
    return res.status(409).json({ error: 'insufficient balance' });
  }

  source.balance -= numericAmount;
  target.balance += numericAmount;

  const transaction = {
    id: nextTransactionId++,
    fromWalletId,
    toWalletId,
    amount: numericAmount,
    status: 'SUCCESS',
    createdAt: new Date().toISOString(),
  };

  transactions.push(transaction);

  return res.status(201).json({
    transaction,
    sourceWallet: source,
    targetWallet: target,
  });
});

router.get('/', (req, res) => {
  return res.status(200).json(transactions);
});

module.exports = router;