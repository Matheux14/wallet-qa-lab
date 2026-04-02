# Test Strategy - Wallet QA Lab

## 1. Purpose
This document defines the quality strategy for the Wallet QA Lab project, a simulated fintech/Web3 transaction system used to demonstrate QA automation practices on critical financial flows.

The objective is to validate:
- functional correctness
- regression safety
- end-to-end user journeys
- basic non-functional performance requirements
- CI quality gates

---

## 2. Scope

### In scope
- backend API healthcheck
- wallet state initialization
- transfer execution
- business validation rules
- frontend transfer journey
- load testing on transfer endpoint
- CI execution of automated backend tests

### Out of scope
- real blockchain interaction
- smart contract execution
- mobile testing
- authentication and authorization
- persistent PostgreSQL storage
- security scanning automation
- contract testing

---

## 3. Quality risks

This project focuses on risks commonly found in financial transaction systems:

- invalid transfer amount accepted
- insufficient balance not blocked
- self-transfer allowed
- inconsistent balances after transaction
- frontend and backend validation mismatch
- regression on critical transaction flow
- degraded performance under concurrent requests

---

## 4. Testing pyramid

### Unit tests
Target small isolated business logic components.

Current status:
- planned for service-layer evolution

### Integration tests
Validate API routes and business behavior through backend endpoints.

Covered:
- GET /health
- successful transfer
- insufficient balance rejection
- self-transfer rejection
- negative amount rejection

### End-to-end tests
Validate complete user workflows through the UI.

Covered:
- initial balances display
- successful transfer via UI
- invalid amount rejection via UI

### Non-functional tests
Validate basic performance behavior using load testing.

Covered:
- load scenario on transfer endpoint with k6
- latency threshold
- failure-rate threshold

---

## 5. Test environments

### Local environment
- backend running on localhost:4000
- frontend served on localhost/127.0.0.1:5500
- Cypress for browser-based validation
- k6 for load testing

### CI environment
- GitHub Actions
- automated backend integration tests

---

## 6. Entry and exit criteria

### Entry criteria
- application starts correctly
- API reachable
- frontend reachable
- deterministic wallet seed available

### Exit criteria
- all backend integration tests pass
- all E2E tests pass
- load-test thresholds respected
- no blocking defect on critical transaction path

---

## 7. Test data strategy

The application uses deterministic seeded wallet data for repeatable tests.

Default dataset:
- wallet 1: ethereum, balance 1000
- wallet 2: polygon, balance 300

Load-test dataset:
- wallet 1: balance 100000
- wallet 2: balance 100000

This approach ensures reproducibility and stable assertions across runs.

---

## 8. Tooling

- Jest + Supertest for backend integration testing
- Cypress for end-to-end UI testing
- k6 for load testing
- GitHub Actions for CI quality gate

---

## 9. Quality gates

Minimum quality expectations:
- backend automated tests must pass
- critical E2E flow must pass
- p95 latency under defined threshold
- HTTP failure rate below defined threshold

Current k6 thresholds:
- p95 < 500 ms
- failure rate < 5%

---

## 10. Future improvements

Recommended next steps:
- add service-layer unit tests
- connect PostgreSQL for persistence validation
- add Pact contract testing
- add OWASP ZAP baseline scan
- add Docker Compose for full local stack
- add GitHub Actions job for Cypress
- add reporting artifacts and coverage publication
- add chaos/fault injection scenarios