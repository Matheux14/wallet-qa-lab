const express = require('express');

const router = express.Router();

let users = [];
let nextUserId = 1;

router.post('/', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }

  const user = {
    id: nextUserId++,
    name,
    email,
    createdAt: new Date().toISOString(),
  };

  users.push(user);

  return res.status(201).json(user);
});

router.get('/', (req, res) => {
  return res.status(200).json(users);
});

module.exports = router;