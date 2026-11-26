#!/bin/bash
set -e

echo "=== Playwright Automation Setup ==="

# 1. Check Node.js
echo ""
echo "[1/4] Checking Node.js..."
if ! command -v node &>/dev/null; then
    echo "ERROR: Node.js not found. Install from https://nodejs.org (v18+)"
    exit 1
fi
NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "ERROR: Node.js v18+ required (found $(node -v))"
    exit 1
fi
echo "OK: $(node -v)"

# 2. Install dependencies
echo ""
echo "[2/4] Installing dependencies..."
npm install
echo "OK: npm packages installed"

# 3. Install Playwright browsers
echo ""
echo "[3/4] Installing Playwright browsers..."
npx playwright install
echo "OK: browsers installed"

# 4. Set up .env
echo ""
echo "[4/4] Setting up environment variables..."
if [ ! -f configs/.env ]; then
    cp configs/.env.example configs/.env
    echo "OK: configs/.env created from .env.example"
    echo "     --> แก้ไขค่าใน configs/.env ก่อนรัน tests"
else
    echo "SKIP: configs/.env already exists"
fi

echo ""
echo "=== Setup complete ==="
echo ""
echo "รัน tests ได้เลย:"
echo "  API  : npx playwright test testCases/api/posts/ --project=api"
echo "  UI   : npx playwright test testCases/orderFlow/ --project=chromium"
echo "  All  : npm test"
