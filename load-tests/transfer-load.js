import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 5 },
    { duration: '20s', target: 20 },
    { duration: '10s', target: 0 }
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.05']
  }
};

const BASE_URL = 'http://localhost:4000';

export function setup() {
  const payload = JSON.stringify({
    data: [
      { id: 1, userId: 1, chain: 'ethereum', balance: 100000 },
      { id: 2, userId: 2, chain: 'polygon', balance: 100000 }
    ]
  });

  const params = {
    headers: { 'Content-Type': 'application/json' }
  };

  const res = http.post(`${BASE_URL}/transactions/seed-wallets`, payload, params);

  check(res, {
    'seed status is 200': (r) => r.status === 200
  });

  return null;
}

export default function () {
  const payload = JSON.stringify({
    fromWalletId: 1,
    toWalletId: 2,
    amount: 1
  });

  const params = {
    headers: { 'Content-Type': 'application/json' }
  };

  const res = http.post(`${BASE_URL}/transactions`, payload, params);

  check(res, {
    'transfer status is 201 or 409': (r) => r.status === 201 || r.status === 409,
    'response time < 500ms': (r) => r.timings.duration < 500
  });

  sleep(1);
}