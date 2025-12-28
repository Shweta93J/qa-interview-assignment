import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  private readonly subtotal: Locator;
  private readonly terms: Locator;
  private readonly checkoutBtn: Locator;

  constructor(private readonly page: Page) {
    this.subtotal = page.locator('.cart-total-right .product-subtotal, .cart-total .product-subtotal').first();
    this.terms = page.locator('#termsofservice');
    this.checkoutBtn = page.locator('#checkout');
  }

  async assertCartLoaded() {
    await expect(this.page).toHaveURL(/\/cart/);
    await expect(this.page.locator('h1')).toHaveText(/Shopping cart/i);
  }

  async getCartSubtotal(): Promise<number> {
    await expect(this.subtotal).toBeVisible();
    const raw = (await this.subtotal.textContent()) ?? '';
    return this.parseMoney(raw);
  }

  async proceedToCheckout() {
    if (!(await this.terms.isChecked())) {
      await this.terms.check();
    }
    await this.checkoutBtn.click();
  }

  private parseMoney(value: string): number {
    const cleaned = value.replace(/[^0-9.]/g, '');
    return Number(cleaned);
  }
}
