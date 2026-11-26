# Playwright E2E — BullVPN Order Flow

End-to-end testing framework for [BullVPN](https://www.bullvpn.com) order flow using Playwright and TypeScript.

## Project Structure

```
Automate Testing/
├── .github/
│   └── workflows/
│       └── playwright.yml      # CI/CD pipeline
├── .husky/                     # Git hooks (pre/post-commit)
├── configs/
│   └── .env                   # Environment variables
├── resources/
│   ├── dataTest/
│   │   └── orderPage.json     # Test input data & scenarios
│   └── expectedResults/
│       └── orderPage.json     # Expected page content
├── support/
│   ├── locators/
│   │   └── orderPage.ts       # Element locators
│   ├── pageObject/
│   │   └── orderPage.ts       # Page Object Model
│   └── utils/
│       └── fileExtensionUtil.ts
├── testCases/
│   └── orderFlow/
│       └── orderFlow.spec.ts  # Test specifications
├── globalVariables.ts
├── index.ts
├── playwright.config.ts
└── tsconfig.json
```

## Prerequisites

- Node.js v18+
- npm

## Installation

```bash
npm install
npx playwright install
```

## Environment Variables

สร้างหรือแก้ไขไฟล์ `configs/.env`:

```env
ENV_BASE_URL=https://www.bullvpn.com
```

## Running Tests

```bash
# Run all tests (Chromium + Firefox + WebKit)
npm test

# Run by tag
npm run test:smoke       # @smoke เท่านั้น
npm run test:high        # @high ทุกตัว
npm run test:medium      # @medium ทุกตัว
npm run test:regression  # @regression ทุกตัว

# Run by browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run with UI mode
npx playwright test --ui

# View HTML report
npx playwright show-report
```

## Test Cases

| TC | Description | Tag |
|---|---|---|
| TC01 | Verify all packages display correct prices | `@smoke` `@high` |
| TC02 | Select 1 Month + QR Code → verify total 249 THB | `@high` |
| TC03 | Select 1 Month + Credit/Debit → verify total 249 THB | `@high` |
| TC04 | Select 7 days + QR Code → verify total 99 THB | `@high` |
| TC05 | Select 1 Year + QR Code → verify total 1,990 THB | `@high` |
| TC06 | Switch packages → verify total updates correctly | `@medium` |
| TC07 | Switch payment methods → verify total is consistent | `@medium` |

## Test Tags

| Tag | Description |
|---|---|
| `@smoke` | Critical path, run on every deploy |
| `@high` | High priority regression |
| `@medium` | Medium priority regression |
| `@regression` | Full regression suite |
| `@ui` | UI tests |

## Cross-Browser

Tests run on **Chromium**, **Firefox**, and **WebKit** (Safari) via Playwright projects config.

## Design Patterns

- **Page Object Model (POM)** — locators และ actions แยกชัดเจน
- **`@step` decorator** — แต่ละ action แสดงใน Playwright trace report
- **Data-driven** — test scenarios, expected values อ่านจาก JSON แยก spec

## Code Quality

```bash
# Format code
npm run format

# Check formatting
npm run format:check
```

Pre-commit hook รัน Prettier อัตโนมัติผ่าน Husky + lint-staged

## CI/CD

GitHub Actions รันทุก push/PR ไปยัง `main` / `master` — ดู `.github/workflows/playwright.yml`

Secrets ที่ต้องตั้งใน GitHub repository:
- `ENV_BASE_URL` — base URL ของ application
