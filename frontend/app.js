const API_BASE_URL = 'http://localhost:4000';

const wallet1BalanceEl = document.getElementById('wallet1-balance');
const wallet2BalanceEl = document.getElementById('wallet2-balance');
const transferForm = document.getElementById('transfer-form');
const amountInput = document.getElementById('amount');
const messageEl = document.getElementById('message');
const transactionsListEl = document.getElementById('transactions-list');

const initialWallets = [
  { id: 1, userId: 1, chain: 'ethereum', balance: 1000 },
  { id: 2, userId: 2, chain: 'polygon', balance: 300 }
];

async function seedWallets() {
  const response = await fetch(`${API_BASE_URL}/transactions/seed-wallets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data: initialWallets })
  });

  if (!response.ok) {
    throw new Error('Impossible d’initialiser les wallets');
  }

  return response.json();
}

function renderBalances(wallets) {
  const wallet1 = wallets.find((w) => w.id === 1);
  const wallet2 = wallets.find((w) => w.id === 2);

  wallet1BalanceEl.textContent = wallet1 ? wallet1.balance : 'N/A';
  wallet2BalanceEl.textContent = wallet2 ? wallet2.balance : 'N/A';
}

function clearTransactions() {
  transactionsListEl.innerHTML = '';
}

function addTransactionToList(transaction) {
  const li = document.createElement('li');
  li.textContent = `Tx #${transaction.id} | ${transaction.amount} transférés de wallet ${transaction.fromWalletId} vers wallet ${transaction.toWalletId} | statut: ${transaction.status}`;
  transactionsListEl.prepend(li);
}

function setMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
}

async function initializeApp() {
  try {
    clearTransactions();
    transferForm.reset();

    const data = await seedWallets();
    renderBalances(data.wallets);
    setMessage('Wallets initialisés avec succès.', 'success');
  } catch (error) {
    setMessage(error.message, 'error');
  }
}

transferForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const rawAmount = amountInput.value;
  const amount = Number(rawAmount);

  if (!rawAmount || Number.isNaN(amount)) {
    setMessage('Veuillez saisir un montant valide.', 'error');
    return;
  }

  if (amount <= 0) {
    setMessage('amount must be greater than 0', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fromWalletId: 1,
        toWalletId: 2,
        amount
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur de transfert');
    }

    renderBalances([data.sourceWallet, data.targetWallet]);
    addTransactionToList(data.transaction);
    setMessage(`Transfert réussi : ${amount} envoyés.`, 'success');
    transferForm.reset();
  } catch (error) {
    setMessage(error.message, 'error');
  }
});

initializeApp();