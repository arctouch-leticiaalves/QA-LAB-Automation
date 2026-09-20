# QA-Lab Automation

Small E2E documentation for the **QA-Lab Android demo app** (`com.arctouch.arctouch_demo_app`).

Stack: **WebdriverIO 9 + TypeScript + Appium (UiAutomator2) + Cucumber**.

## What this suite covers

| Area | Examples |
|---|---|
| Auth | Login, signup, forgot password, logout, reset app |
| Shop | Browse, search, filters, favorites, grid/list |
| Product detail | Open PDP, carousel, favorite, quantity, add to cart |
| Cart & checkout | Cart management, happy path + validation/declined card |
| Orders | Seed list/filters/detail + new order after checkout |
| Profile | Edit profile, favorites, settings entry points |
| Additional Tests | Drag & drop, carousel, slider, date/time/range, OTP, tab bar, etc. |

Features live in `features/*.feature` and are tagged (e.g. `@smoke`, `@regression`, `@android`, `@checkout`, `@orders`).

## Prerequisites

- Node **20+**
- JDK **17** (recommended)
- Android SDK (`adb` on `PATH`, `ANDROID_HOME` / `ANDROID_SDK_ROOT` set)
- Running emulator or device (`adb devices`)

## Setup

```bash
npm ci
APPIUM_HOME="$(pwd)/.appium" npx appium driver install uiautomator2
cp .env.example .env
```

Edit `.env` for your device. Typical local values:

```env
ANDROID_PLATFORM_VERSION=16
ANDROID_DEVICE_NAME=Pixel_9
ANDROID_UDID=emulator-5554
ANDROID_APP_PATH=apps/android/QA-Lab.apk
APPIUM_HOST=127.0.0.1
APPIUM_PORT=4723
```

Default test user: `testing@arctouch.com` / `QA1234`.

## Run tests

Appium is started by `@wdio/appium-service` when you run WDIO (`APPIUM_HOME` is pinned to `.appium/`).

```bash
# Full suite
npm run test:android

# Smoke / regression
npm run test:android:smoke
npm run test:android:regression

# By feature tag
npm run test:android -- --cucumberOpts.tags="@orders"
npm run test:android -- --cucumberOpts.tags="@product-detail"
npm run test:android -- --cucumberOpts.tags="@checkout and @android"

# Static checks
npm run typecheck
npm run lint
```

Allure report (after a run):

```bash
npm run allure:report
```

## Project layout

```text
features/                 # Gherkin scenarios
src/
  config/                 # Capabilities / env
  locators/               # Selectors per screen
  screens/                # Page Objects (actions + queries)
  steps/                  # Thin Cucumber steps
  support/                # Base screen, app actions, test data
apps/android/QA-Lab.apk   # App under test
wdio.conf.ts              # Shared WDIO config
wdio.android.conf.ts      # Android + Appium service
```

## Conventions (short)

- **AAA** in Gherkin: `Given` arrange · `When` act · `Then` assert
- **Page Object Model**: screens own interactions; steps stay thin
- Prefer **accessibility / content-desc** locators over XPath
- Keep assertions in steps, not inside screen objects

## CI

GitHub Actions (`.github/workflows/`) runs static checks and Android E2E on emulator. See the workflow file for tag inputs and artifacts (Allure / logs / screenshots).
