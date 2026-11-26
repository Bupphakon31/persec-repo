import { test } from "@playwright/test";
import { ENV } from "globalVariables";
import { onFileExtensionUtil } from "@support/utils/fileExtensionUtil";
import { OrderPage } from "@index";

const dataTest = onFileExtensionUtil.readDataFromJson("./resources/dataTest/orderPage.json");
const expectedResult = onFileExtensionUtil.readDataFromJson("./resources/expectedResults/orderPage.json");

test.describe("BullVPN Order Flow", () => {
    let onOrderPage: OrderPage;

    test.beforeEach(async ({ page }) => {
        onOrderPage = new OrderPage(page);
        await page.goto(String(ENV.ENV_BASE_URL));
        await onOrderPage.navigateToOrderViaNavbar();
        await onOrderPage.dismissCookieBanner();
    });

    test(
        "TC01 - Verify all packages are displayed with correct prices",
        { tag: ["@high", "@regression", "@ui", "@smoke"] },
        async () => {
            await onOrderPage.verifyOrderPage(expectedResult);
            await onOrderPage.verifyPackagePrices(expectedResult.packages);
        }
    );

    for (const scenario of dataTest.testScenarios) {
        test(
            `Verify total for "${scenario.package}" with ${scenario.payment} = ${scenario.expectedPrice} THB`,
            { tag: ["@high", "@regression", "@ui"] },
            async () => {
                await onOrderPage.selectPackage(scenario.package);
                await onOrderPage.selectPaymentMethod(scenario.payment);
                await onOrderPage.verifyTotalAmount(scenario.expectedPrice);
            }
        );
    }

    test(
        "TC06 - Verify total amount updates when switching between packages",
        { tag: ["@medium", "@regression", "@ui"] },
        async () => {
            await onOrderPage.selectPaymentMethod(dataTest.tc06.initialPayment);
            for (const step of dataTest.tc06.steps) {
                await onOrderPage.selectPackage(step.package);
                await onOrderPage.verifyTotalAmount(step.expectedPrice);
            }
        }
    );

    test(
        "TC07 - Verify total amount is consistent across payment methods",
        { tag: ["@medium", "@regression", "@ui"] },
        async () => {
            await onOrderPage.selectPackage(dataTest.tc07.package);
            for (const step of dataTest.tc07.paymentSteps) {
                await onOrderPage.selectPaymentMethod(step.payment);
                await onOrderPage.verifyTotalAmount(step.expectedPrice);
            }
        }
    );
});
