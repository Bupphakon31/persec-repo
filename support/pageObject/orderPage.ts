import { type Page, expect } from "@playwright/test";
import { OrderPageLocators } from "@support/locators/orderPage";
import { step } from "@index";

export class OrderPage {
    readonly locators: OrderPageLocators;
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.locators = new OrderPageLocators(page);
    }

    @step("Navigate to Order page via navbar")
    async navigateToOrderViaNavbar() {
        await this.locators.navOrderLink.click();
        await expect(this.page).toHaveURL(/\/order/);
    }

    @step("Dismiss cookie banner if present")
    async dismissCookieBanner() {
        const btn = this.locators.cookieAgreeButton;
        if (await btn.isVisible({ timeout: 3000 })) {
            await btn.click();
        }
    }

    @step("Verify order page is displayed")
    async verifyOrderPage(expected: Record<string, any>) {
        await expect(this.locators.upgradeHeading).toContainText(expected.heading);
    }

    @step((duration: string) => `Select package: ${duration}`)
    async selectPackage(duration: string) {
        await this.locators.packageCard(duration).click();
    }

    @step((method: string) => `Select payment method: ${method}`)
    async selectPaymentMethod(method: string) {
        await this.locators.paymentTab(method).click();
    }

    @step((expectedAmount: string) => `Verify total amount contains "${expectedAmount}"`)
    async verifyTotalAmount(expectedAmount: string) {
        await expect(this.locators.totalAmount).toContainText(`${expectedAmount} THB`);
    }

    @step("Verify all packages display correct prices")
    async verifyPackagePrices(packages: Array<{ duration: string; price: string }>) {
        await Promise.all(
            packages.map(({ duration, price }) =>
                expect(this.locators.packagePrice(duration)).toContainText(price)
            )
        );
    }
}
