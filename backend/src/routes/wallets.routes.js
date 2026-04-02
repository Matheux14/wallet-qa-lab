const express = require('express');

const router = express.Router();

let wallets = [];
let nextWalletId = 1;

router.post('/', (req, res) => {
  const { userId, chain, balance } = req.body;

  if (!userId || !chain) {
    return res.status(400).json({ error: 'userId and chain are required' });
  }

  const wallet = {
    id: nextWalletId++,
    userId,
    chain,
    balance: Number(balance ?? 0),
    createdAt: new Date().toISOString(),
  };

  wallets.push(wallet);

  return res.status(201).json(wallet);
});

router.get('/', (req, res) => {
  return res.status(200).json(wallets);
});

module.exports = router;