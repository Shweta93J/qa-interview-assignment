import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  private readonly email: Locator;
  private readonly password: Locator;
  private readonly loginBtn: Locator;

  constructor(private readonly page: Page) {
    this.email = page.locator('#Email');
    this.password = page.locator('#Password');
    this.loginBtn = page.locator('input[value="Log in"]');
  }

  async login(email: string, password: string) {
    await this.page.goto('/login');
    await expect(this.page.locator('h1')).toHaveText(/Welcome, Please Sign In!/i);

    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginBtn.click();

    // If login succeeds, "Log out" becomes visible.
    await expect(this.page.locator('a[href="/logout"]')).toBeVisible({ timeout: 10_000 });
  }
}
