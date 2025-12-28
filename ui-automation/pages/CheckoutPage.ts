import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  private btnContinue(stepSelector: string): Locator {
    return this.page.locator(stepSelector).locator('input.button-1, input[type="button"]').first();
  }

  async checkoutAsGuestIfPrompted() {
    // If the user is not logged in, site shows checkout method step with "Checkout as Guest".
    const guestBtn = this.page.locator('input[value="Checkout as Guest"]');
    if (await guestBtn.isVisible().catch(() => false)) {
      await guestBtn.click();
    }
  }

  async fillBillingIfRequired() {
    // On guest checkout, billing address form appears. Keep inputs minimal and realistic.
    const firstName = this.page.locator('#BillingNewAddress_FirstName');
    if (await firstName.isVisible().catch(() => false)) {
      await firstName.fill('Test');
      await this.page.locator('#BillingNewAddress_LastName').fill('User');
      await this.page.locator('#BillingNewAddress_Email').fill(`test.user.${Date.now()}@example.com`);

      await this.page.locator('#BillingNewAddress_CountryId').selectOption({ label: 'United Arab Emirates' }).catch(async () => {
        // fallback if UAE not present in list for some reason
        await this.page.locator('#BillingNewAddress_CountryId').selectOption({ index: 1 });
      });

      await this.page.locator('#BillingNewAddress_City').fill('Dubai');
      await this.page.locator('#BillingNewAddress_Address1').fill('Test Street 1');
      await this.page.locator('#BillingNewAddress_ZipPostalCode').fill('00000');
      await this.page.locator('#BillingNewAddress_PhoneNumber').fill('0500000000');
    }
  }

  async completeCheckout() {
    // Billing
    await this.checkoutAsGuestIfPrompted();
    await this.fillBillingIfRequired();
    await this.page.locator('input.button-1.new-address-next-step-button').click();

    // Shipping address (some flows skip)
    const shipContinue = this.page.locator('input.button-1.shipping-address-next-step-button');
    if (await shipContinue.isVisible().catch(() => false)) {
      await shipContinue.click();
    }

    // Shipping method
    const shipMethod = this.page.locator('input.button-1.shipping-method-next-step-button');
    if (await shipMethod.isVisible().catch(() => false)) {
      await shipMethod.click();
    }

    // Payment method
    const payMethod = this.page.locator('input.button-1.payment-method-next-step-button');
    if (await payMethod.isVisible().catch(() => false)) {
      await payMethod.click();
    }

    // Payment info
    const payInfo = this.page.locator('input.button-1.payment-info-next-step-button');
    if (await payInfo.isVisible().catch(() => false)) {
      await payInfo.click();
    }

    // Confirm
    const confirm = this.page.locator('input.button-1.confirm-order-next-step-button');
    await expect(confirm).toBeVisible({ timeout: 15_000 });
    await confirm.click();
  }

  async expectOrderSuccess() {
    const title = this.page.locator('.page-title');
    await expect(title).toContainText(/Thank you/i);
    await expect(this.page.locator('.section.order-completed')).toContainText(/successfully processed/i);
  }
}
