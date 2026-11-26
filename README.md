# Playwright Automation — BullVPN & JSONPlaceholder

Automation testing framework ที่รองรับทั้ง **UI** และ **API** testing ด้วย Playwright + TypeScript

---

## Project Structure

```
Automate Testing/
├── .github/
│   └── workflows/
│       └── playwright.yml              # CI/CD pipeline
├── .husky/                             # Git hooks (pre-commit)
├── configs/
│   └── .env                           # Environment variables
├── docs/
│   └── test-cases/                    # Mindmaps & test case docs
├── plugins/
│   └── httpRequest.ts                 # HTTP context factory
├── resources/
│   ├── dataTest/
│   │   ├── common.json                # Shared headers & test data
│   │   ├── orderPage.json             # UI test input data
│   │   └── posts.json                 # API test input data
│   └── expectedResults/
│       ├── common.json                # Shared HTTP status codes
│       ├── orderPage.json             # Expected UI content
│       └── posts.json                 # Expected API responses
├── support/
│   ├── locators/
│   │   └── orderPage.ts               # Element locators
│   ├── pageObject/
│   │   └── orderPage.ts               # Page Object Model
│   ├── services/
│   │   ├── common.ts                  # Shared assertion helpers
│   │   └── postsService.ts            # Posts API service
│   └── utils/
│       └── fileExtensionUtil.ts       # JSON file reader
├── testCases/
│   ├── api/
│   │   └── posts/
│   │       ├── posts.business.spec.ts # Happy path tests
│   │       └── posts.validation.spec.ts # Negative/edge tests
│   └── orderFlow/
│       └── orderFlow.spec.ts          # UI E2E tests
├── globalVariables.ts
├── index.ts
├── playwright.config.ts
└── tsconfig.json
```

---

## Prerequisites

| Tool | Version | ตรวจสอบ |
|---|---|---|
| Node.js | v18+ | `node -v` |
| npm | v9+ | `npm -v` |
| Git | any | `git -v` |

## Installation

### Quick Setup (แนะนำ)

```bash
git clone <repository-url>
cd "Automate Testing"
./setup.sh
```

`setup.sh` จะทำทุกขั้นตอนอัตโนมัติ: ตรวจสอบ Node.js → ติดตั้ง packages → ติดตั้ง browsers → สร้าง `.env`

---

### Manual Setup

**1. Clone repository**

```bash
git clone <repository-url>
cd "Automate Testing"
```

**2. Install dependencies**

```bash
npm install
```

**3. Install Playwright browsers**

```bash
npx playwright install
```

**4. ตั้งค่า Environment Variables**

```bash
cp configs/.env.example configs/.env
```

แก้ไข `configs/.env`:

```env
# UI
ENV_BASE_URL=https://www.bullvpn.com

# API
JSONPLACEHOLDER_BASE_URL=https://jsonplaceholder.typicode.com
POSTS_PATH=/posts
COMMENTS_PATH=/comments
```

> `configs/.env` ถูก ignore โดย git — ห้าม commit ไฟล์นี้

**5. ตรวจสอบการติดตั้ง**

```bash
npx playwright test testCases/api/posts/ --project=api
npx playwright test testCases/orderFlow/ --project=chromium
```

ถ้าเห็น `X passed` แสดงว่าติดตั้งสำเร็จ

---

## Running Tests

```bash
# Run all tests
npm test

# Run by project
npx playwright test --project=api        # API tests only
npx playwright test --project=chromium   # UI tests (Chromium)
npx playwright test --project=firefox    # UI tests (Firefox)
npx playwright test --project=webkit     # UI tests (WebKit)

# Run by tag
npm run test:regression   # @regression (business/happy path)
npm run test:high         # @high ทุกตัว
npm run test:smoke        # @smoke เท่านั้น

# Run specific spec
npx playwright test testCases/api/posts/

# UI mode
npx playwright test --ui

# View HTML report
npx playwright show-report
```

---

## Test Cases

### API — JSONPlaceholder Posts (20 tests)

#### Business `posts.business.spec.ts` — `@high @regression`

| # | Description |
|---|---|
| 1 | GET /posts → 200, returns 100 posts with required fields |
| 2 | GET /posts/:id → 200, response body matches expected post |
| 3 | GET /posts/:id/comments → 200, returns 5 comments |
| 4 | GET /comments?postId= → 200, all comments match given postId |
| 5 | GET /comments?postId= equals GET /posts/:id/comments |
| 6 | GET /posts?userId= → 200, all posts belong to given userId |
| 7 | POST /posts → 201, response contains posted data with id 101 |
| 8 | PUT /posts/:id → 200, response reflects all updated fields |
| 9 | PATCH /posts/:id → 200, updated field changed, others remain |
| 10 | DELETE /posts/:id → 200, response body is empty object |

#### Validation `posts.validation.spec.ts` — `@high @functional`

| # | Description |
|---|---|
| 1 | GET /posts/:id → 404 when id does not exist |
| 2 | GET /posts/:id → 404 when id is boundary zero |
| 3 | GET /posts/:id → 404 when id is negative |
| 4 | GET /posts/:id/comments → 200 `[]` when post does not exist |
| 5 | GET /posts/:id/comments → all comments have postId matching requested post |
| 6 | GET /comments?postId= → 200 `[]` when no results |
| 7 | PUT /posts/:id → 404 when id does not exist |
| 8 | PATCH /posts/:id → 200 when id does not exist (fake API accepts) |
| 9 | DELETE /posts/:id → 200 when id does not exist (fake API accepts) |
| 10 | POST /posts → 201 when body is empty (fake API assigns id only) |

### UI — BullVPN Order Flow (7 tests)

| TC | Description | Tag |
|---|---|---|
| TC01 | Verify all packages display correct prices | `@smoke` `@high` |
| TC02 | Select 1 Month + QR Code → total 249 THB | `@high` |
| TC03 | Select 1 Month + Credit/Debit → total 249 THB | `@high` |
| TC04 | Select 7 days + QR Code → total 99 THB | `@high` |
| TC05 | Select 1 Year + QR Code → total 1,990 THB | `@high` |
| TC06 | Switch packages → total updates correctly | `@medium` |
| TC07 | Switch payment methods → total is consistent | `@medium` |

---

## Test Tags

| Tag | Description |
|---|---|
| `@high` | High priority |
| `@regression` | Business/happy path — ใช้ใน regression run |
| `@functional` | Feature validation & negative cases |
| `@smoke` | Critical path, run on every deploy |
| `@medium` | Medium priority |

---

## Architecture

### API Testing Pattern

```
plugins/httpRequest.ts          → createContextHTTPRequest() with failOnStatusCode: false
support/services/postsService.ts → call*() methods + verify*() methods (singleton)
support/services/common.ts      → compareRespMsgWithExpectedFile()
resources/dataTest/*.json       → test input data
resources/expectedResults/*.json → expected response bodies & status codes
```

- **Plugin layer** — `onHTTPRequest.createContextHTTPRequest()` wraps `request.newContext()` พร้อม `failOnStatusCode: false`
- **Service singleton** — `export const onPostsService: PostsService = new PostsService()`
- **`try/finally`** — `contextHTTP.dispose()` รันเสมอแม้ response ผิดพลาด
- **`let response` reassignment** — normalize raw response เป็น `{ statusCode, statusText, body }`
- **Spec split** — `.business.spec.ts` (happy path) + `.validation.spec.ts` (negative/edge)
- **`test.beforeAll`** — โหลด JSON fixtures ครั้งเดียวก่อนรัน suite

### UI Testing Pattern

- **Page Object Model (POM)** — locators และ actions แยกชัดเจน
- **`@step` decorator** — แต่ละ action แสดงใน Playwright trace report
- **Data-driven** — test scenarios และ expected values อ่านจาก JSON แยก spec

---

## Code Quality

```bash
# Format code
npm run format

# Check formatting
npm run format:check
```

Pre-commit hook รัน Prettier อัตโนมัติผ่าน Husky + lint-staged

---

## CI/CD

GitHub Actions รันทุก push/PR ไปยัง `main` / `master` — ดู `.github/workflows/playwright.yml`

Secrets ที่ต้องตั้งใน GitHub repository:
- `ENV_BASE_URL` — base URL ของ application
- `JSONPLACEHOLDER_BASE_URL` — JSONPlaceholder base URL
