import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  private readonly searchBox: Locator;
  private readonly searchButton: Locator;

  constructor(private readonly page: Page) {
    this.searchBox = page.locator('#small-searchterms');
    this.searchButton = page.locator('input[value="Search"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async searchFor(term: string) {
    await this.searchBox.fill(term);
    await this.searchButton.click();
    await expect(this.page).toHaveURL(/search/);
  }

  async openCart() {
    await this.page.locator('a[href="/cart"]').click();
  }
}
