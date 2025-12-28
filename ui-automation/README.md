# UI Automation (Playwright + TypeScript)

This module automates a real user flow on https://demowebshop.tricentis.com.

## What is covered
**Scenario:** Place an order with multiple products and verify price calculations.

The test:
- Adds 2 different products (quantity is data-driven via JSON)
- Verifies the cart subtotal equals the sum of (unitPrice * qty) for each product
- Completes checkout (guest checkout by default; optional login via env vars)
- Confirms order success message

## Setup
```bash
cd ui-automation
npm install
npx playwright install
```

## Run
```bash
npx playwright test
```

Run headed (optional):
```bash
npx playwright test --headed
```

## Report
```bash
npx playwright show-report
```

## Test data
Product data is in:
- `test-data/products.json`

## Environment variables (optional)
You can create a `.env` file locally (not committed) and add:
- `DEMO_EMAIL`
- `DEMO_PASSWORD`

If not provided, the test proceeds using Guest checkout.
