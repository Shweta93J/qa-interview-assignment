import { Page, Locator, expect } from '@playwright/test';

export class SearchResultsPage {
  constructor(private readonly page: Page) {}

  productLinkByName(name: string): Locator {
    // The search results list has product titles as links.
    return this.page.locator('.product-title a', { hasText: name }).first();
  }

  async openProduct(name: string) {
    const link = this.productLinkByName(name);
    await expect(link).toBeVisible();
    await link.click();
  }
}
