import { Page, Locator, expect } from '@playwright/test';

export class ProductPage {
  private readonly addToCartButton: Locator;
  private readonly qtyInput: Locator;

  constructor(private readonly page: Page) {
    this.addToCartButton = page.locator('input[value="Add to cart"]');
    this.qtyInput = page.locator('input.qty-input');
  }

  async getUnitPrice(): Promise<number> {
    // Some products show .product-price, others show span with itemprop=price.
    const priceLocator = this.page.locator(
      '.product-price, span[itemprop="price"]'
    ).first();

    await expect(priceLocator).toBeVisible();
    const raw = (await priceLocator.textContent()) ?? '';
    return this.parseMoney(raw);
  }

  async addToCart(quantity: number) {
    // Not all product pages have editable qty (some do).
    if (await this.qtyInput.count()) {
      await this.qtyInput.fill(String(quantity));
    }

    await this.addToCartButton.click();

    // DemoWebShop shows a green notification bar; wait for it, then move on.
    const bar = this.page.locator('#bar-notification');
    await expect(bar).toBeVisible({ timeout: 10_000 });
    await bar.locator('.close').click().catch(() => {});
  }

  private parseMoney(value: string): number {
    const cleaned = value.replace(/[^0-9.]/g, '');
    return Number(cleaned);
  }
}
