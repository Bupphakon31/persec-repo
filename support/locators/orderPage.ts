import { type Page } from "@playwright/test";

const PAYMENT_TAB_IDS: Record<string, string> = {
    "QR Code": "headingQr",
    "Credit/Debit": "headingCard",
    "PayPal": "headingPaypal",
    "True Wallet": "headingTw",
};

export class OrderPageLocators {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get navOrderLink() {
        return this.page.locator("a.nav-link[data-gtm-action='click_Order']").first();
    }

    get upgradeHeading() {
        return this.page.getByRole("heading", { name: /upgrade account/i });
    }

    packageCard(duration: string) {
        return this.page.locator("label.price-item").filter({ hasText: duration });
    }

    packagePrice(duration: string) {
        return this.packageCard(duration).locator("div.package-price");
    }

    paymentTab(method: string) {
        const id = PAYMENT_TAB_IDS[method];
        if (!id) throw new Error(`Unknown payment method: "${method}". Valid: ${Object.keys(PAYMENT_TAB_IDS).join(", ")}`);
        return this.page.locator(`#${id}`);
    }

    get totalAmount() {
        return this.page.locator(".tab-pane.show.active .summary-list-last p.font-weight-bold").first();
    }

    get buyNowButton() {
        return this.page.locator("button.btn-submit");
    }

    get cookieAgreeButton() {
        return this.page.locator("button.acceptcookies");
    }

    get emailOrUsernameField() {
        return this.page.locator("#email");
    }

    get discountCodeField() {
        return this.page.locator(".tab-pane.show.active input[name='discount_code']");
    }
}
