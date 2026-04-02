const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const healthRoutes = require('./routes/health.routes');
const usersRoutes = require('./routes/users.routes');
const walletsRoutes = require('./routes/wallets.routes');
const transactionsRoutes = require('./routes/transactions.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/health', healthRoutes);
app.use('/users', usersRoutes);
app.use('/wallets', walletsRoutes);
app.use('/transactions', transactionsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'route not found' });
});

module.exports = app;