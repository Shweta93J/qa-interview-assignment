import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { AuthPage } from '../pages/AuthPage';

import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

type ProductInput = { name: string; quantity: number };

function loadProducts(): ProductInput[] {
  const filePath = path.join(__dirname, '..', 'test-data', 'products.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw).products as ProductInput[];
}

test('Place order with multiple products (price calculation checks)', async ({ page }) => {
  const home = new HomePage(page);
  const results = new SearchResultsPage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);
  const auth = new AuthPage(page);

  const products = loadProducts();

  // Optional login (runs guest checkout if credentials are not provided)
  const email = process.env.DEMO_EMAIL;
  const password = process.env.DEMO_PASSWORD;
  if (email && password) {
    await auth.login(email, password);
  }

  let expectedSubtotal = 0;

  for (const item of products) {
    await home.goto();
    await home.searchFor(item.name);

    await results.openProduct(item.name);

    const unitPrice = await product.getUnitPrice();
    expectedSubtotal += unitPrice * item.quantity;

    await product.addToCart(item.quantity);
  }

  await home.openCart();
  await cart.assertCartLoaded();

  const cartSubtotal = await cart.getCartSubtotal();

  // Price is displayed with 2 decimals. Using close-to avoids flaky failures due to formatting.
  expect(cartSubtotal).toBeCloseTo(expectedSubtotal, 2);

  await cart.proceedToCheckout();
  await checkout.completeCheckout();
  await checkout.expectOrderSuccess();
});
